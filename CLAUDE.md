# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Paytm-style payments app built as a **Turborepo monorepo** managed with **npm workspaces** (`npm@11.6.4`, Node >= 18). Workspaces live under `apps/*` and `packages/*`. Turbo orchestrates all tasks; tasks declare their dependencies in `turbo.json`.

## Workspaces

- `apps/user-app` — end-user Next.js app, runs on **port 3000**. Uses Next 16.2 + React 18. Has NextAuth credentials login (`lib/auth.ts`, `api/auth/[...nextauth]/route.ts`).
- `apps/merchent-app` — merchant Next.js app, runs on **port 3001**. Uses Next 16.2 + React 19. Mostly scaffolding so far. (Note the directory is spelled `merchent-app`.)
- `packages/database` (`@repo/database`) — Prisma client + schema + seed. Exports the singleton `prisma` from `src/client.ts`.
- `packages/store` (`@repo/store`) — shared Jotai atoms/hooks (e.g. `balanceAtom`, `useBalance`).
- `packages/config-eslint` (`@repo/eslint-config`), `packages/config-typescript` (`@repo/typescript-config`), `packages/tailwind-config` (`@repo/tailwind-config`) — shared configs consumed by the apps/packages.

## Commands

Run from the repo root unless noted. All wrap `turbo run <task>`.

```bash
npm run dev          # start all apps (user-app:3000, merchent-app:3001)
npm run build        # build all workspaces
npm run lint         # eslint across workspaces (--max-warnings 0)
npm run format       # prettier --write on **/*.{ts,tsx,md}
npm run generate     # prisma generate (regenerate the Prisma client)
```

Target a single workspace with Turbo's `--filter`:

```bash
turbo run dev --filter=user-app
turbo run build --filter=@repo/database
```

There is **no test runner configured** — `@repo/store`'s `test` script is a placeholder that exits 1.

### Database

```bash
npm run db:migrate:dev      # create + apply a migration (prompts for a name; persistent)
npm run db:migrate:deploy   # apply migrations in production (no prompt)
npm run db:push             # push schema without a migration
npm run db:seed             # run packages/database/src/seed.ts (upserts DEFAULT_USERS)
                            # seeded users log in with their number + password "password"
                            # (e.g. number 1111111111). Password is bcrypt-hashed at seed time.
```

Prisma Studio: `cd packages/database && npm run studio`.

## Architecture notes

- **Prisma client output is custom.** It is generated to `packages/database/generated/client` (see `schema.prisma`'s `generator.output`), not the default `node_modules/.prisma`. `src/client.ts` imports from `../generated/client` and re-exports everything (`export * from "../generated/client"`), so consumers import models/types from `@repo/database`. Run `npm run generate` after any schema change — `predev`/`prebuild` hooks in `packages/database` also run it automatically.
- **DB connection uses the pg driver adapter.** `client.ts` builds a `pg.Pool` from `DATABASE_URL` and passes it to `PrismaPg` (`@prisma/adapter-pg`). The `prisma` instance is cached on `global` outside production to survive hot reload.
- **`DATABASE_URL` is required** for all Prisma work and is the only `globalEnv` declared in `turbo.json`. Local Postgres comes from `docker-compose.yml` (`postgres:15`, db `turborepo`, user `sebi`, port `5432`). Start it with `docker-compose up -d`. Each Prisma-consuming workspace expects its own `.env` (e.g. `packages/database/.env`, `apps/user-app/.env`).
- **Auth** (user-app): NextAuth `CredentialsProvider` keyed on phone `number` + `password`. `authorize` auto-creates a user on first login (bcrypt-hashed password), and the `session` callback puts `token.sub` on `session.user.id`. Secret comes from `JWT_SECRET`.
- **Shared state**: apps wrap their tree in the Jotai `Provider` (`user-app/components/providers/provider.tsx`) and read shared atoms via `@repo/store` (e.g. `Balance.tsx` → `useBalance`).

## IMPORTANT: Next.js 16

Both apps run Next.js 16 (`next@16.2.x`), which has **breaking changes vs. older Next.js**. Per `apps/merchent-app/AGENTS.md`: APIs, conventions, and file structure may differ from prior knowledge — read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed deprecation notices.
