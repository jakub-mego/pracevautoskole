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

Coolify na Hetzner VPS — `deploy/coolify.yml` (TODO).
