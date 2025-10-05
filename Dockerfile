FROM node:22-alpine AS base

WORKDIR /app

ENV ENV=production

RUN apk add --no-cache openssl curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser && \
    adduser nodeuser nodejs && \
    chown -R nodeuser:nodejs /app

FROM base AS deps
COPY package*.json ./
RUN npm pkg delete scripts.prepare && \
    npm ci && \
    npm cache clean --force

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm ci --omit=dev

FROM base AS runner
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/package.json ./
USER nodeuser

CMD ["npm", "run", "start"]
