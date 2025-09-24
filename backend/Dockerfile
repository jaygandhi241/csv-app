# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci || npm i

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM base AS runtime
RUN addgroup -S nodejs && adduser -S node -G nodejs
USER node
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node prisma ./prisma
RUN npx prisma generate
COPY --chown=node:node src ./src
COPY --chown=node:node package.json ./package.json
ENV PORT=4000
EXPOSE 4000
CMD ["node", "src/server.js"]


