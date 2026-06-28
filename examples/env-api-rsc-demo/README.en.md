# Env API + RSC Multi-Environment Build

> Related chapter: Part 05 · Environment API · 5.10

---

> ⚠️ **Important**: This project uses the Vite **Environment API**, which is currently in **RC stage**.
> Specific API names and interfaces may change in future minor releases.
> This project is pinned to Vite `8.1.x` and does not use the floating `^8.1` range.
> After running the project, please check the [Vite official changelog](https://vitejs.dev/changes) to confirm whether any APIs have been updated.

---

## What You Will Learn

By building an RSC-like multi-environment build demo, you will gain a deep understanding of the three core pillars of the Environment API:

- **`Environment`** — An isolated module graph; each environment (client/ssr/rsc) has its own independent `moduleGraph`
- **`ModuleRunner`** — Runs modules within a specified Environment, equivalent to executing `import()` in that environment
- **`HotChannel`** — A cross-environment HMR message channel that allows the client to react to server module updates

## Prerequisites

- Understanding of Vite SSR basics (Part 08)
- Familiarity with the concept of React Server Components (no deep knowledge required)
- Having read the first three sections of Part 05 Environment API

## What You Will Build

A minimal multi-environment build configuration featuring:

- `client` environment → bundled as browser JS
- `ssr` environment → Node.js SSR entry point
- `rsc` environment → RSC Server-dedicated module graph

Demonstrates how the three environments can share certain modules while keeping sensitive code isolated from one another.

## Step Breakdown

| Step | Directory              | Content                                           |
| ---- | ---------------------- | ------------------------------------------------- |
| 1    | steps/01-basic-env     | Configure client + ssr two Environments           |
| 2    | steps/02-rsc-env       | Add a custom rsc Environment                      |
| 3    | steps/03-module-runner | Use ModuleRunner to run components in the rsc env |
| 4    | steps/04-hot-channel   | Configure cross-environment HMR                   |
| 5    | final/                 | Complete demo + documentation                     |

## Quick Start

```bash
pnpm install
pnpm dev
```

> If you encounter API errors, it is likely a Vite version mismatch. Please verify that the vite version in `package.json` is strictly equal to `8.1.x`.

## Known Limitations (RC Stage)

- The `import()` method signature of `ModuleRunner` may change
- The `resolve` configuration option for custom Environments is not yet stable
- The event name conventions for HotChannel may be adjusted

See `compatibility-matrix.md` in this directory (if it exists) for details.
