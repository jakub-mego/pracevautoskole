# pracevautoskole.cz

Oborově specializované pracovní tržiště pro autoškoly a profesionály oboru v ČR.
Dvoustranné matching — autoškoly i profesionálové mají profil i inzerát "hledám".

## Stack

- Next.js 16 (App Router, Turbopack) + React 19.2
- TypeScript, Tailwind CSS 4, shadcn/ui
- PostgreSQL 16 + Drizzle ORM
- Better Auth (email+password)
- Stripe + Fio Bank API, Resend, MinIO (S3-kompatibilní)
- Hosting: Coolify na Hetzner VPS

## Lokální vývoj

Předpoklady: Node 20.9+, pnpm 10+, Docker.

```bash
# 1) Nastartovat Postgres + MinIO
docker compose up -d

# 2) Nakopírovat env šablonu a doplnit secrety
cp .env.example .env.local

# 3) Instalace + první sync schématu
pnpm install
pnpm db:push    # lokálně rychlé; pro produkci použij db:generate + db:migrate

# 4) Dev server
pnpm dev
```

Aplikace běží na `http://localhost:3000`.
MinIO konzole: `http://localhost:9001` (user/pass z docker-compose.yml).

## Scripty

| Script | Co dělá |
|---|---|
| `pnpm dev` | Next.js dev server (Turbopack) |
| `pnpm build` | Produkční build |
| `pnpm start` | Produkční start |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check bez emitu |
| `pnpm db:push` | Přímý sync schématu s DB (dev) |
| `pnpm db:generate` | Vygenerovat SQL migraci |
| `pnpm db:migrate` | Aplikovat migrace |
| `pnpm db:studio` | Drizzle Studio (GUI nad DB) |

## Struktura

Viz `../dev/repo-structure.md`.

## Deploy

Build je standalone Docker image (`output: "standalone"` v `next.config.ts`).
Image dělá:

1. `node scripts/migrate.mjs` — aplikuje Drizzle migrace na DB z `DATABASE_URL`
2. `node server.js` — startuje Next.js server na portu 3000

Healthcheck endpoint: `GET /api/health` (vrací 503 pokud DB nesedí).

### Coolify (Hetzner VPS)

1. **Nová Application** → Dockerfile, repo & větev
2. **Resource limits**: 1 vCPU + 512 MB stačí pro start
3. **Environment variables** (production):
   - `DATABASE_URL` — managed Postgres v Coolify
   - `BETTER_AUTH_SECRET` — `openssl rand -base64 48`
   - `BETTER_AUTH_URL=https://pracevautoskole.cz`
   - `NEXT_PUBLIC_APP_URL=https://pracevautoskole.cz`
   - `RESEND_API_KEY`, `EMAIL_FROM` (ověřená doména v Resendu)
   - `ARES_BASE_URL=https://ares.gov.cz/ekonomicke-subjekty-v-be/rest`
   - (volitelné) `MINIO_*`, `STRIPE_*`, `FIO_API_TOKEN` — až budou potřeba
4. **Domain** + automatické HTTPS přes Caddy
5. **Healthcheck**: Coolify sám čte `HEALTHCHECK` z Dockerfile

### Lokální build test

```bash
docker build -t pracevautoskole .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=postgresql://pva:pva_dev_password@host.docker.internal:5432/pracevautoskole \
  -e BETTER_AUTH_SECRET=test-test-test-test-test-test-test \
  -e BETTER_AUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  pracevautoskole
```
