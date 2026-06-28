# Monorepo Template

> Related chapter: Part 11 · Monorepo Engineering · 11.3

## What You Will Learn

By replicating the engineering structure of vite-mastery, you will master the core concepts of pnpm workspace Monorepos:

- **pnpm workspace** dependency management (`workspace:*` protocol)
- **Cross-package pre-bundling** — let `apps/` consume uncompiled TypeScript directly from `packages/`
- **Turborepo caching strategy** — incremental builds that only recompile changed packages
- **Vite 8 `resolve.alias`** — resolve packages directly to their `src/` in dev mode, skipping the compile step

## Prerequisites

- Basic understanding of pnpm workspaces
- Familiarity with the `exports` field in `package.json`

## Project Structure

```text
monorepo-template/
  apps/
    web/          ← Main application (Vite 8 + React)
  packages/
    ui/           ← Shared UI component library
    utils/        ← Shared utility functions
  pnpm-workspace.yaml
  turbo.json
```

## What You Will Build

A production-ready Monorepo starter:

- `apps/web` imports `@monorepo/ui` and `@monorepo/utils` directly
- Dev mode: changes to `packages/` source are reflected instantly in `apps/web` (no rebuild needed)
- Build mode: Turborepo builds packages in parallel, with automatic dependency graph ordering

## Quick Start

```bash
pnpm install
pnpm dev     # Start the apps/web dev server
pnpm build   # Build all packages
```

## Step-by-Step Breakdown

| Step | Directory           | Content                               |
| ---- | ------------------- | ------------------------------------- |
| 1    | steps/01-workspace  | pnpm workspace + basic structure      |
| 2    | steps/02-vite-alias | Configure Vite alias pointing to src/ |
| 3    | steps/03-turbo      | Turborepo build caching               |
| 4    | final/              | Complete template                     |
