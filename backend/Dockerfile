FROM node:20-slim AS builder

WORKDIR /app

# Copiamos los archivos de configuración del monorepo
COPY package.json turbo.json ./
COPY backend/package.json ./backend/

# Instalamos las dependencias
RUN npm install

# Copiamos el código fuente del backend
COPY backend ./backend

# Generamos el cliente de Prisma y construimos
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Stage de producción
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copiamos los artefactos necesarios del builder
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/index.js"]
