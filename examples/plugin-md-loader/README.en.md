# Markdown loader plugin

> Companion chapter: Part 04 · Hooks deep dive · 4.8

## What you'll learn

By turning `.md` files into hot-reloadable React components, you'll get deep with Vite's `transform` hook:

- **`transform(code, id)`** — the highest-frequency hook, fires once per module load; can rewrite source and return a source map
- **File filtering** — use `id.endsWith(".md")` to avoid touching every module
- **HMR boundaries** — how `import.meta.hot.accept()` actually works

## Prerequisites

- Comfortable with React basics
- Familiar with Markdown
- Finished the "Virtual module plugin" example

## What you'll build

A `vite-plugin-md` plugin that lets you import `.md` files directly:

```tsx
import Post from "./posts/hello.md"

function App() {
  return <Post /> // renders the Markdown content
}
```

With HMR support: edit the `.md` file and the browser refreshes live, preserving component state.

## Step breakdown

| Step | Directory              | Content                              |
| ---- | ---------------------- | ------------------------------------ |
| 1    | steps/01-transform     | Minimal transform hook               |
| 2    | steps/02-md-to-html    | Convert markdown to HTML with marked |
| 3    | steps/03-react-wrapper | Wrap as a React component            |
| 4    | steps/04-hmr           | Add the HMR accept boundary          |
| 5    | final/                 | Complete plugin + types              |

## Quick start

```bash
pnpm install
pnpm dev
```

## Stretch challenges

- Extract frontmatter (title / date / tags)
- Add syntax highlighting (integrate Shiki)
- Publish to npm so other projects can reuse it
