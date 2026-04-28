# syntax=docker/dockerfile:1.7
# Multi-stage build pro Next.js standalone output

ARG NODE_VERSION=20.18-alpine

# ── Stage 0: base s pnpm ───────────────────────────────────────────────
FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.33.0

# ── Stage 1: full deps (dev + prod) pro build ──────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ── Stage 2: prod-only deps pro migrace v runneru ──────────────────────
FROM base AS deps-prod
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ── Stage 3: build ─────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgres://build:build@localhost:5432/build
ENV BETTER_AUTH_SECRET=build-only-not-used-at-runtime
RUN pnpm build

# ── Stage 4: runner ────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
# Vlastní node_modules pro migrate skript (Node hledá nejblíž).
COPY --from=deps-prod --chown=nextjs:nodejs /app/node_modules ./scripts/node_modules

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Apply migrace, pak start. Crash při chybě migrace je úmyslný.
CMD ["sh", "-c", "node scripts/migrate.mjs && node server.js"]
