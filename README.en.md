# Vite Mastery

[中文 README](README.md)

Vite Mastery is a bilingual deep-dive guide for frontend engineers who want to understand **Vite 8 internals**, not just project setup.

The site now supports English and Chinese routes. `/` redirects to `/en` by default, while Chinese content is available under `/zh`.

## Focus

Vite Mastery covers the parts of Vite that are usually treated as black boxes:

- Vite 8's unified build model and Rolldown architecture
- Vite, Rollup, and Rolldown plugin relationships
- Hook execution order and plugin pipeline behavior
- HMR protocol, module graph behavior, and dependency pre-bundling
- Environment API concepts, SSR workflows, and multi-environment isolation
- Real-world plugin examples and runnable project templates

## Content

The current content set is bilingual:

- 85 English MDX lessons
- 85 Chinese MDX lessons
- 14 main chapters
- 10 standalone examples
- 8 interactive documentation components

| Part     | Topic                      | Lessons |
| -------- | -------------------------- | ------- |
| 00       | Getting Started            | 5       |
| 01       | Core Concepts              | 6       |
| 02       | Bundler Evolution          | 5       |
| 03       | Plugin System              | 6       |
| 04       | Hooks Deep Dive            | 9       |
| 05       | Environment API            | 10      |
| 06       | HMR                        | 6       |
| 07       | Build Pipeline             | 9       |
| 08       | SSR & SSG                  | 4       |
| 09       | Framework Integration      | 6       |
| 10       | Library Mode               | 3       |
| 11       | Monorepo Engineering       | 4       |
| 12       | Performance                | 7       |
| 13       | Real World Plugins         | 4       |
| Appendix | Vite 7 to Vite 8 Migration | 1       |

## Features

- **Bilingual routing**: `/en` and `/zh` share the same content model, and `/` defaults to English.
- **Version-aware content**: every MDX lesson includes `viteVersion` and `apiStability` frontmatter.
- **Vite 7 difference notes**: behavior differences are isolated in `<V7Note>` instead of interrupting the main Vite 8 narrative.
- **Interactive learning components**: `HookExplorer`, `PluginPipeline`, `HmrDemo`, `BundlerCompare`, `EnvironmentExplorer`, `ConfigPlayground`, `DepGraph`, and `V7Note`.
- **Rich code blocks**: Shiki-powered highlighting with filenames, copy buttons, highlighted lines, diff rendering, and TypeScript hover hints.
- **WebContainer playground**: `apps/playground` runs real Vite examples in the browser.

## Repository Layout

```text
vite-mastery/
├── apps/
│   ├── web/                        # Main site, Next.js 16 App Router
│   └── playground/                 # WebContainer playground
├── packages/
│   ├── ui/                         # shadcn/ui v4 + Base UI component package
│   ├── mdx-components/             # MDX components
│   ├── content-config/             # content-collections schema
│   ├── tailwind-config/            # Shared Tailwind v4 design tokens
│   ├── tsconfig/                   # Shared TypeScript configs
│   └── eslint-config/              # Shared oxlint configs
├── content/                        # English and Chinese MDX lessons
├── examples/                       # 10 runnable example projects
├── scripts/                        # Content scaffolding and validation scripts
├── PLAN.md                         # Full content plan
└── COMPACT.md                      # Project context for AI-assisted continuation
```

## Development

Requirements:

- Node.js 24+
- pnpm 11+

```bash
pnpm install
pnpm dev
pnpm build:web
pnpm typecheck
pnpm lint
pnpm check:content
```

Common scripts:

| Command                 | Purpose                                |
| ----------------------- | -------------------------------------- |
| `pnpm dev`              | Start the main site                    |
| `pnpm dev:playground`   | Start the WebContainer playground      |
| `pnpm build:web`        | Build the main site                    |
| `pnpm build:playground` | Build the playground                   |
| `pnpm check:content`    | Validate MDX frontmatter and rules     |
| `pnpm new:doc`          | Scaffold a new lesson                  |
| `pnpm new:example`      | Scaffold a new example project         |
| `pnpm new:v7note`       | Generate a standard `<V7Note>` snippet |

## Current Validation Status

- `pnpm --filter @vite-mastery/web typecheck` passes
- `pnpm build:web` passes
- `pnpm check:content` exits with code 0, with a few remaining content-quality warnings
- `/` is pinned to `/en` and no longer follows stale locale cookies or `Accept-Language`

## Before Launch

- Review Rolldown, Environment API, and Vite 8.1.x statements carefully, especially RC API names and hook behavior.
- Recalculate all `readingTime` values.
- Fill in detailed `steps/` walkthroughs for the 10 examples.
- Wire Pagefind index generation into the build flow and document why search is limited in dev mode.
- Run desktop/mobile Lighthouse checks and documentation accessibility regression tests.

## License

MIT
