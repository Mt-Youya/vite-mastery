# @vite-mastery/content-config

`@content-collections/core` 的共享配置层 —— 站点引入它就拿到 `docs` / `examples` 两个 collection 的 schema 和 transform。

## 用法

```ts
// apps/web/content-collections.ts
import { defineContentConfig } from "@vite-mastery/content-config"

export default defineContentConfig()
```

## 两个 collection

| 名称       | 来源                    | frontmatter                     | 用途         |
| ---------- | ----------------------- | ------------------------------- | ------------ |
| `docs`     | `content/**/*.mdx`      | 见 [schemas.ts](src/schemas.ts) | 教程正文     |
| `examples` | `examples/*/README.mdx` | 同上                            | 实战项目卡片 |

## 为什么是 content-collections 而不是 Contentlayer

Contentlayer 自 2024 起停更;`@content-collections/*` 对 Next.js 16 App Router、Turbopack 友好,且配置就是 TS 文件而不是 .contentlayer config。
