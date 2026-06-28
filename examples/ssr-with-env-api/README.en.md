# Handwritten SSR (Environment API)

> Related chapter: Part 08 · SSR & SSG · 8.2

## What You Will Learn

Build an SSR application from scratch using Vite 8's **Environment API**, and understand the fundamental difference between the new SSR model and the legacy approach (`ssrLoadModule`):

- **Legacy model** — `server.ssrLoadModule(url)` loads modules in a special mode within a single shared module graph
- **New model** — the `ssr` Environment has its own dedicated `moduleGraph`, and server-side code is executed via `ModuleRunner`

By comparing the two approaches, you will gain a thorough understanding of why Vite 8 introduced the Environment API.

## Prerequisites

- Basic understanding of Node.js HTTP servers
- Familiarity with React's `renderToString`
- Having read the opening sections of Part 05 Environment API

## What You Will Build

A minimal SSR server consisting of:

1. Express (or Node's built-in `http`) as the HTTP layer
2. Vite 8 dev server middleware for module hot-reloading
3. The `ssr` Environment + `ModuleRunner` to execute the server-side rendering function
4. Client-side hydration

## Step Breakdown

| Step | Directory          | Description                               |
| ---- | ------------------ | ----------------------------------------- |
| 1    | steps/01-server    | Node HTTP server + Vite middleware        |
| 2    | steps/02-ssr-env   | Create the ssr Environment + ModuleRunner |
| 3    | steps/03-render    | Run React renderToString via ModuleRunner |
| 4    | steps/04-hydration | Client-side hydration                     |
| 5    | final/             | Complete SSR server                       |

## Quick Start

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` and inspect the HTML source to confirm SSR is working correctly — the response should contain rendered content rather than an empty `<div id="root">`.
