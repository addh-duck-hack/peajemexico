# Etapa de construcción
FROM node:22-slim AS build
WORKDIR /app
COPY ./app-angular/ .
RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install
RUN npm run build -- --configuration production
RUN echo "Verificando archivos en dist:" && ls -la /app/dist/app-angular/browser || echo "No se encontró /app/dist/app-angular/browser"

# Etapa de producción con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/app-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN echo "Verificando archivos en nginx html:" && ls -la /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
