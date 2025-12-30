FROM node:22 AS builder

WORKDIR /app

# Copiamos archivos de configuración
COPY package.json turbo.json ./
COPY frontend/package.json ./frontend/

# Instalamos dependencias
RUN npm install

# Copiamos código fuente
COPY frontend ./frontend

# Construimos la aplicación
WORKDIR /app/frontend
RUN npm run build

# Stage de producción
FROM nginx:alpine AS runner

# Copiamos los archivos construidos
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Configuración de nginx para SPA (Single Page Application)
RUN echo 'server { \
    listen 3000; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

