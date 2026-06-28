# Virtual module plugin

> Companion chapter: Part 03 · Plugin system · 3.4

## What you'll learn

Build a virtual-module plugin and master Vite's two most fundamental hooks:

- **`resolveId`** — intercept `import "virtual:xxx"` and return a special module id (prefixed with `\0` so the filesystem doesn't try to resolve it)
- **`load`** — given that special id, return dynamically generated module content (a string of ES module code)

## Prerequisites

- Familiar with ES modules
- Comfortable with basic Vite usage

## What you'll build

A plugin called `vite-plugin-virtual` that supports:

```ts
import meta from "virtual:site-meta"
console.log(meta.buildTime) // build timestamp
console.log(meta.version) // package.json version
```

The data is injected at build time by the plugin — zero runtime cost.

## Step breakdown

| Step | Directory               | Content                          |
| ---- | ----------------------- | -------------------------------- |
| 1    | steps/01-bare-plugin    | Minimal runnable plugin skeleton |
| 2    | steps/02-resolveId-load | Implement resolveId + load       |
| 3    | steps/03-hmr            | Add HMR support                  |
| 4    | final/                  | Complete plugin with types       |

## Quick start

```bash
pnpm install
pnpm dev
```

Open the browser and watch `meta.buildTime` log to the console. Edit the metadata in `src/plugin.ts` to feel HMR.

## Stretch challenges

- Make the plugin accept options for custom injected content
- Generate a `.d.ts` declaration file for the virtual module
- Support multiple virtual modules (`virtual:foo` / `virtual:bar`)
