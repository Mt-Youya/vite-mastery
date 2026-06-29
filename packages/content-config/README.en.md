# @vite-mastery/content-config

Shared `@content-collections/core` configuration for Vite Mastery. The web app imports this package to get the schema and transforms for the `docs` and `examples` collections.

## Usage

```ts
// apps/web/content-collections.ts
import { defineContentConfig } from "@vite-mastery/content-config"

export default defineContentConfig()
```

## Collections

| Name       | Source                  | Frontmatter                      | Purpose               |
| ---------- | ----------------------- | -------------------------------- | --------------------- |
| `docs`     | `content/**/*.mdx`      | See [schemas.ts](src/schemas.ts) | Lesson content        |
| `examples` | `examples/*/README.mdx` | See [schemas.ts](src/schemas.ts) | Example project cards |

## Why content-collections

Contentlayer has been largely inactive since 2024. `@content-collections/*` works well with Next.js 16 App Router and Turbopack, and the configuration stays in TypeScript instead of a separate generated config layer.
