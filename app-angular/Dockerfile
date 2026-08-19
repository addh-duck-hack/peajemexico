# Etapa de construcción
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

# Etapa de producción con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/app-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN echo "Verificando archivos en nginx html:" && ls -la /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
