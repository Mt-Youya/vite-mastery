# @vite-mastery/mdx-components

MDX components that can be used directly inside Vite Mastery lessons.

## Entrypoints

| Entrypoint                                        | Contents                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `@vite-mastery/mdx-components`                    | `Callout`, `CodeBlock`, `CodeGroup`, `Detail`, `Diff`, `Steps`, `Tabs` |
| `@vite-mastery/mdx-components/shiki`              | Shared Shiki highlighter and default transformers                      |
| `@vite-mastery/mdx-components/use-mdx-components` | Helpers for `apps/web/mdx-components.tsx`                              |

## Components

| Component     | Purpose                                                         | Status |
| ------------- | --------------------------------------------------------------- | ------ |
| `<Callout>`   | Lesson callouts with five semantic types                        | Done   |
| `<CodeBlock>` | Shiki-rendered code with filename, highlights, and copy support | Done   |
| `<CodeGroup>` | Multiple code blocks grouped by filename                        | Done   |
| `<Diff>`      | Semantic wrapper for diff-style code blocks                     | Done   |
| `<Steps>`     | Numbered step lists using CSS counters                          | Done   |
| `<Detail>`    | Collapsible detail block based on `<details>`                   | Done   |
| `<Tabs>`      | MDX-friendly tab shorthand                                      | Done   |

Interactive components such as `HookExplorer`, `PluginPipeline`, `HmrDemo`, `ConfigPlayground`, and `DepGraph` live in the web app because they depend on client-side state and routing context.
