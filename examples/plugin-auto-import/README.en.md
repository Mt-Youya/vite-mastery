# Simplified auto-import Plugin

> Related chapter: Part 13 · Real-World Plugin Showcase · 13.4

## What You Will Learn

By implementing the core mechanism of `unplugin-auto-import`, you will exercise almost every plugin hook covered in this course:

- **`transform`** — scan source files and detect APIs used without an explicit import
- **`resolveId + load`** — inject auto-generated import statements as a virtual module
- **`generateBundle`** — emit a `.d.ts` type declaration file
- **`configureServer`** — watch source files in dev mode and incrementally update the import map

This is the capstone "kitchen sink" exercise for the entire plugin system. After completing it, you will be able to read roughly 75% of community plugin source code with confidence.

## Prerequisites

- Complete the "virtual modules plugin", "Markdown loader", and "i18n injection" hands-on projects
- Understand the basic concept of an AST (you do not need to write a parser by hand)

## What You Will Build

A `vite-plugin-auto-import` plugin that enables the following usage pattern:

```ts
// No manual import needed — use ref / computed directly
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

The plugin analyzes every file for APIs in use, looks them up in the configured presets to find their source library, and automatically inserts the corresponding import statements.

## Step Breakdown

| Step | Directory        | Content                                                      |
| ---- | ---------------- | ------------------------------------------------------------ |
| 1    | steps/01-scan    | Use regex to scan source files for unimported identifiers    |
| 2    | steps/02-resolve | Look up each identifier in a table to find its import source |
| 3    | steps/03-inject  | Inject import statements inside the `transform` hook         |
| 4    | steps/04-dts     | Output a `.d.ts` file in `generateBundle`                    |
| 5    | steps/05-watch   | Watch new files and process them incrementally               |
| 6    | final/           | Complete plugin + types + tests                              |

## Quick Start

```bash
pnpm install
pnpm dev
```

Edit `src/main.ts` and use `ref` / `computed` and other APIs without importing them, then check the console for any errors.

## Extension Challenges

- Support presets beyond Vue Composition API (react-use / lodash-es / vueuse)
- Support the TypeScript triple-slash directive `/// <reference types="./auto-imports.d.ts" />`
- Integrate with the ESLint `no-undef` rule to prevent lint errors
