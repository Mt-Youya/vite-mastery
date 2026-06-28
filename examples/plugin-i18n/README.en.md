# i18n Auto-Injection Plugin

> Related chapter: Part 04 · Hooks Deep Dive · 4.9

## What You Will Learn

By building an i18n injection plugin, you will understand two high-frequency hooks unique to Vite:

- **`transformIndexHtml`** — modify `index.html` content during both the dev server and build phases
- **`resolveId` + `load`** — expose locale files as virtual modules, eliminating manual imports

## Prerequisites

- Understanding of virtual module plugins (Example Project 1)
- Basic knowledge of i18n concepts (key-value translation mapping)

## What You Will Build

A `vite-plugin-i18n` plugin that lets you write code like this:

```ts
import t from "virtual:i18n"
console.log(t("hello")) // → "你好"
console.log(t("welcome")) // → "欢迎使用 Vite"
```

Locale data is read from `locales/zh.json`. Switching languages only requires a config change — no changes to application code.

## Step Breakdown

| Step | Directory               | Description                                           |
| ---- | ----------------------- | ----------------------------------------------------- |
| 1    | steps/01-locale-virtual | Turn the locale file into a virtual module            |
| 2    | steps/02-inject-html    | Use transformIndexHtml to inject the `lang` attribute |
| 3    | steps/03-watch          | Watch locale file changes to trigger HMR              |
| 4    | final/                  | Complete plugin + multi-language switching example    |

## Quick Start

```bash
pnpm install
pnpm dev
```

Edit `locales/zh.json` — changes to the locale file will trigger hot module replacement.

## Extension Challenges

- Support runtime language switching (dynamic import at runtime)
- Generate a type-safe `t()` function (keys with TypeScript auto-completion)
- Support interpolated translation strings, e.g. `t("greeting", { name: "Jay" })`
