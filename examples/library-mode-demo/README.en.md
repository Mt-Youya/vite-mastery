# Cross-Framework Component Library (Library Mode)

> Related chapter: Part 10 · Library Mode · 10.3

## What You Will Learn

Use Vite's **library mode** to build a component library that supports React / Vue / Svelte / Solid simultaneously:

- **`build.lib`** — Enable library mode, control entry points, output formats, and file names
- **`rollupOptions.external`** — Exclude the framework itself from the bundle output
- **`build.rollupOptions.output.globals`** — Declare global variable names for UMD format
- **Monorepo package splitting strategy** — `core` holds shared logic; each framework package only handles the adapter layer

## Prerequisites

- Familiarity with React / Vue component authoring
- Understanding of the `main` / `module` / `exports` fields in an npm package

## Project Structure

```text
library-mode-demo/
  packages/
    core/       ← Framework-agnostic core logic
    react/      ← React adapter layer
    vue/        ← Vue 3 adapter layer
    svelte/     ← Svelte adapter layer
    solid/      ← Solid.js adapter layer
  pnpm-workspace.yaml
```

## What You Will Build

A `<Button>` component, built once, with outputs for:

- `esm/` — ES Module (tree-shakable)
- `cjs/` — CommonJS (backward compatible)
- Type declarations `.d.ts`

Each of the five frameworks has its own adapter package, all consuming the same core logic.

## Quick Start

```bash
pnpm install
pnpm build        # Build all sub-packages
```

Check the `dist/` directory of each package to confirm the ESM / CJS dual-format output.

## Step Breakdown

| Step | Directory      | Content                              |
| ---- | -------------- | ------------------------------------ |
| 1    | steps/01-core  | Implement pure logic in core package |
| 2    | steps/02-react | React adapter + library mode config  |
| 3    | steps/03-vue   | Vue adapter                          |
| 4    | steps/04-types | Generate .d.ts type declarations     |
| 5    | final/         | Full five-framework output           |
