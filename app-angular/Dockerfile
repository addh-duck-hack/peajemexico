# Etapa de construcción (compartida por las dos imágenes de abajo)
FROM node:22-slim AS build
WORKDIR /app
COPY ./app-angular/ .
# El @angular/cli y @angular/build del proyecto ya están en package.json (devDependencies)
# y "npm run build" los resuelve localmente (node_modules/.bin/ng) sin necesitar un CLI
# global. Antes se instalaba "@angular/cli @angular-devkit/build-angular" global sin fijar
# versión, lo que jalaba "latest" (Angular 22) en vez de la versión 20 que usa este proyecto
# -y ese "latest" a veces queda roto en el registro de npm justo tras publicarse, como pasó
# el 2026-08-19 con @schematics/angular@22.1.5 (ETARGET). "npm ci" usa el package-lock.json
# tal cual, así el build es reproducible y no depende de qué versión sea "latest" ese día.
RUN npm ci
RUN npm run build -- --configuration production
RUN echo "Verificando archivos en dist:" && ls -la /app/dist/app-angular/browser || echo "No se encontró /app/dist/app-angular/browser"

# --- Imagen 1: nginx, sirve el sitio estático (todo excepto /guias y /noticias) ---
FROM nginx:alpine AS nginx-runtime
COPY --from=build /app/dist/app-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN echo "Verificando archivos en nginx html:" && ls -la /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# --- Imagen 2: Node SSR, renderiza /guias y /noticias en cada visita (ver
# app.routes.server.ts y src/server.ts) para que una entrada recién publicada
# desde /admin aparezca de inmediato, sin esperar un rebuild. nginx (imagen de
# arriba) le reenvía específicamente esas rutas -ver nginx.conf-.
FROM node:22-slim AS ssr-runtime
WORKDIR /app
COPY --from=build /app/dist/app-angular/browser ./dist/app-angular/browser
COPY --from=build /app/dist/app-angular/server ./dist/app-angular/server
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/app-angular/server/server.mjs"]
