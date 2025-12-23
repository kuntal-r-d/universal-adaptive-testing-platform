# Universal Adaptive Testing Platform
# Multi-stage Dockerfile

# ============================================
# Base Stage
# ============================================
FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

WORKDIR /app

# ============================================
# Dependencies Stage
# ============================================
FROM base AS deps

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api-service/package.json ./apps/api-service/
COPY packages/@uat/backend-common/package.json ./packages/@uat/backend-common/

RUN pnpm install --frozen-lockfile

# ============================================
# Development Stage
# ============================================
FROM base AS development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]

# ============================================
# Build Stage
# ============================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ============================================
# Production Stage
# ============================================
FROM base AS production

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-service/dist ./apps/api-service/dist
COPY --from=builder /app/packages/@uat/backend-common/dist ./packages/@uat/backend-common/dist
COPY --from=builder /app/package.json ./

EXPOSE 3000

USER node

CMD ["node", "apps/api-service/dist/index.js"]

