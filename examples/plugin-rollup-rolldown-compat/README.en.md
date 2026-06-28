# Rollup / Rolldown Dual-Bundler Compatible Plugin

> Related chapter: Part 02 · Bundler Evolution · 2.5

## What You Will Learn

By writing a plugin that runs on both **Rollup** (via `rolldown-vite`) and **Rolldown** (Vite 8), you will understand the hook API differences and compatibility boundaries between the two bundlers:

- Which Rollup hooks behave identically in Rolldown
- Which hooks have extended parameters in Rolldown (e.g., the `envName` parameter on `renderChunk`)
- How to use runtime detection for conditional adaptation instead of maintaining two separate codebases

## Prerequisites

- Complete the "Virtual Modules Plugin" and "Markdown Loader" hands-on projects
- Understand the Vite 7 → Vite 8 bundler migration background (Part 02)

## What You Will Build

A `vite-plugin-bundle-analyzer` plugin that outputs a module dependency analysis report after the build completes:

- Lists the size and included modules for each chunk
- Flags modules whose size exceeds a threshold
- Passes tests on both Vite 7 (rolldown-vite) and Vite 8 (Rolldown)

## Step Breakdown

| Step | Directory               | Content                                              |
| ---- | ----------------------- | ---------------------------------------------------- |
| 1    | steps/01-generateBundle | Read the bundle using the generateBundle hook        |
| 2    | steps/02-renderChunk    | Compare renderChunk parameters in Rollup vs Rolldown |
| 3    | steps/03-compat-layer   | Write the compatibility layer function               |
| 4    | final/                  | Complete plugin + compatibility tests                |

## Quick Start

```bash
pnpm install
# Run with Vite 8 (Rolldown)
pnpm build

# To test Rollup compatibility, switch to the rolldown-vite branch and follow the instructions in compatibility-matrix.md
```

Check the console for the bundle analysis report.
