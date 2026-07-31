# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

PeajeMexico is a two-service web app for calculating Mexican highway toll ("caseta") costs for routes with multiple destinations, backed by INEGI's toll API. It consists of:

- `app-angular/` — Angular 20 (zoneless, standalone components) frontend
- `backend/` — Express + MongoDB (Mongoose) API that proxies/authenticates requests to the external INEGI toll-cost service and handles auth/mail

Both services are containerized independently and composed via `docker-compose.yml` (Angular behind Nginx on host port 105, backend on host port 106 mapped to container port 5000).

**Product direction (in progress, not yet reflected in code):**
- Target production domain is **peajesmx.com** (superseding the earlier "peajesmexico.com" idea). No code currently hardcodes either domain, but when deployment/CORS/email-link config is touched, use `peajesmx.com`.
- Access model is moving from fully closed (every calculation requires a registered/authenticated user) to open: any visitor can run the core toll calculation, with new premium features reserved for registered users. The specific premium features aren't defined yet — confirm with the user before assuming what's gated. **Backend done (2026-07-29):** `destination.routes.js` (`GET /:search`) and `route.cost.routes.js` (`POST /calculate`, `POST /details`) no longer require `verifyToken` — they're public, rate-limited to 30 req/10min per IP via `tollCalculatorRateLimiter` (`middleware/rateLimitMiddleware.js`). Same limit applies to anonymous and authenticated callers for now (no premium differentiation yet). **Frontend done (2026-07-31):** the navbar and home-page "Calcular mi ruta" CTAs now route directly to `/dashboard/price` instead of `/login`; `pages/dashboard/dashboard.ts` no longer force-redirects unauthenticated visitors away; `price-dashboard.ts` no longer redirects guests when there's no valid session token (it just calls the now-public endpoints with an empty token). `price-dashboard` is currently the *only* dashboard view meant to be usable without an account — `home-dashboard` and `history-dashboard` remain stubs. The dashboard's admin-style chrome (`navbar-dashboard`, `side-menu-dashboard`, `footer-dashboard` — leftovers from a different project) was removed entirely; `dashboard.html` now reuses the site's own `Navbar`/`MainFooter` components so `/dashboard/price` is visually consistent with the rest of the public site (no login/logout UI in the dashboard area for now — there's no live login flow anyway since `user.routes.js` isn't mounted). The Angular `InegiService` still always sends an `Authorization: Bearer <token>` header (empty string for guests) — harmless since the backend doesn't require it.

## Commands

### Frontend (`app-angular/`)
Run from inside `app-angular/`:
- `npm start` / `ng serve` — dev server at `http://localhost:4200`
- `npm run build` — production build to `dist/`
- `npm run watch` — dev build with `--watch`
- `npm test` / `ng test` — Karma/Jasmine unit tests
- `ng test --include='**/some.spec.ts'` — run a single spec file
- `ng generate component path/to/name` — scaffold a new standalone component

### Backend (`backend/`)
Run from inside `backend/`:
- `npm start` — starts the API with `node server.js`
- No lint/test scripts are configured (`npm test` is a placeholder that exits with an error)
- Requires a `.env` file (see `.env.example`) — the server throws on startup if `MONGO_URL_GLOBAL`, `CORS_ALLOWED_ORIGINS`, or any required `JWT_*` var is missing/invalid (`JWT_SECRET` must be ≥32 chars)

### Docker
- `docker-compose up --build` from the repo root builds and runs both services together (frontend on `:105`, backend on `:106`).

## Architecture

### Backend request flow
`backend/server.js` wires global middleware (`cors`, `helmet`, JSON body parsing) and mounts routers under `/api/ds/...`. Route handlers follow a consistent middleware chain: rate limiter → payload validator (`middleware/validationMiddleware.js`) → auth (`verifyToken` / `authorizeRoles` / `authorizeSelfOrRoles` / `authorizeSelf` from `middleware/authMiddleware.js`) → handler. All error responses go through the shared `sendError(res, status, code, message, details)` helper in `utils/httpResponses.js`, producing a uniform `{ ok: false, error: { status, code, message, details? } }` shape.

**Currently mounted routes** (see `server.js`): `mail.routes.js` (`/api/ds/mail`), `destination.routes.js` (`/api/ds/destination`), `route.cost.routes.js` (`/api/ds/route/cost`). `user.routes.js` and `upload.routes.js` exist and are fully implemented but are **commented out** in `server.js` — check there before assuming an endpoint is live. Note the frontend's `UserService` and `openapi.yaml` both reference `/api/users/...` / `/api/ds/users/...` auth endpoints that are not currently mounted; treat this as a known gap, not a bug to silently "fix" without confirming intent.

**Auth model**: JWTs are signed/verified in `utils/jwt.js` with three distinct token types (`access`, `email_verification`, `reset_password`) that are mutually rejected by each verify function — a token minted for one purpose cannot be used for another. Roles are `super_admin` and `customer` (`middleware/authMiddleware.js`'s `ROLES`); `authorizeSelfOrRoles`/`authorizeSelf` let a user act on their own resource without needing an elevated role.

**INEGI integration**: `destination.routes.js` and `route.cost.routes.js` are thin authenticated proxies to the external INEGI API — they build `application/x-www-form-urlencoded` requests using `INEGI_*` env vars (URL, API key, response type, projection, etc.) and pass through the JSON response wrapped as `{ ok, message, inegi }`.

**Image uploads**: `middleware/imageUploadMiddleware.js` accepts a file into memory via `multer`, then re-validates it by actual decoded content (via `sharp`, not just mimetype) and re-encodes it to strip unexpected payloads before writing to disk with a random filename. `utils/uploads.js` resolves the writable uploads directory, preferring `UPLOADS_DIR` and falling back to `/tmp/media-uploads`.

**CORS**: origins are strictly allow-listed via `CORS_ALLOWED_ORIGINS`; a separate `CORS_ALLOW_LOCAL_DEV=true` flag additionally allows a fixed set of localhost ports (4200/4201/3000/3001/5173) and requests with no `Origin` header — this flag should stay `false` in production.

### Frontend structure
Standalone Angular components (no NgModules), zoneless change detection, lazy-loaded routes (`app.routes.ts`) via `loadComponent`. Layout:
- `app/pages/` — routed top-level pages (`home`, `about-us`, `contact-us`, `services`, `dashboard` with nested `home-dashboard`/`price-dashboard`/`history-dashboard`)
- `app/auth/` — `login`, `reset-password`, `validate-email` flows
- `app/shared/components/` — reusable UI (navbar, footers, carousels, dashboard chrome, skeleton loaders)
- `app/shared/interfaces/` — TypeScript interfaces mirroring backend response shapes
- `app/services/` — `UserService` (session/auth, backed by `localStorage` under `environment.localStorageName`, with JWT expiry checked client-side by decoding the payload) and `InegiService` (destination search + route cost calculation, both requiring a bearer token from the session)

Environment config lives in `src/environments/environment*.ts` (imported via the `@environments/*` TS path alias) and defines `urlbackend`, `companyName`, `companySlogan`, and `localStorageName`. Styling uses Tailwind CSS v4 (`@tailwindcss/postcss`) plus `@tailwindplus/elements`; route maps use `leaflet`.

## Working across the two services

Backend and frontend are developed and versioned together in this repo but deployed as separate containers with no shared code/types — when changing an API contract, update both the Express route and the corresponding Angular service/interface by hand, and check `backend/openapi.yaml` for drift (it documents `/api/users/...` paths that don't match the live `/api/ds/...` mount prefix, so don't treat it as ground truth without cross-checking `server.js`).
