FROM node:20-slim AS builder

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
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copiamos artefactos
COPY --from=builder /app/frontend/package.json ./
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
