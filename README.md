# vite-mastery

> English: [README.en.md](README.en.md)

Vite Mastery 是一套面向进阶前端工程师的 **Vite 8 深度学习指南**。主站已经接入中英双语路由：`/` 默认进入 `/en`，中文内容保留在 `/zh`。

它关注的不是“如何创建一个 Vite 项目”，而是 Vite 背后的核心机制：

- Vite 8 的统一构建模型与 Rolldown 架构
- Vite / Rollup / Rolldown 插件体系与 hooks 时序
- HMR 协议、模块图、依赖预构建和生产构建管线
- Environment API、SSR、多环境隔离和框架集成
- 可独立运行的实战项目与插件案例

## 内容规模

当前内容已经完成双语化：

- 79 篇英文 MDX 教程
- 79 篇中文 MDX 教程
- 14 个主章节
- 10 个可独立运行的 examples
- 8 个交互式文档组件

| Part     | 主题                                        | 文章数 |
| -------- | ------------------------------------------- | ------ |
| 00       | Getting Started · 入门铺垫                  | 4      |
| 01       | Core Concepts · 核心概念                    | 4      |
| 02       | Bundler Evolution · esbuild→Rolldown 演进史 | 5      |
| 03       | Plugin System · 插件系统                    | 6      |
| 04       | Hooks Deep Dive · Hooks 时序与源码导读      | 9      |
| 05       | Environment API · 多环境隔离（RC 阶段）     | 10     |
| 06       | HMR · 热更新全链路                          | 6      |
| 07       | Build Pipeline · 生产构建管道               | 7      |
| 08       | SSR & SSG                                   | 4      |
| 09       | Framework Integration · 多框架集成          | 6      |
| 10       | Library Mode · 库模式                       | 3      |
| 11       | Monorepo 工程化                             | 4      |
| 12       | Performance · 性能优化                      | 6      |
| 13       | Real World Plugins · 真实插件源码导读       | 4      |
| Appendix | Vite 7 → 8 迁移指南                         | 1      |

## 站点能力

- **双语路由**：`/en` 和 `/zh` 共用同一套内容模型，`/` 固定重定向到英文。
- **版本感知内容**：每篇 MDX 都带 `viteVersion` 和 `apiStability` frontmatter。
- **Vite 7 差异折叠**：Vite 7 与 Vite 8 的行为差异统一放进 `<V7Note>`，避免污染正文主线。
- **交互式学习组件**：包括 `HookExplorer`、`PluginPipeline`、`HmrDemo`、`BundlerCompare`、`EnvironmentExplorer`、`ConfigPlayground`、`DepGraph` 和 `V7Note`。
- **Shiki 代码块**：支持文件名、复制按钮、行高亮、diff 展示和 TypeScript 类型提示。
- **WebContainer Playground**：`apps/playground` 提供浏览器内运行真实 Vite 示例的实验场。

## 仓库结构

```text
vite-mastery/
├── apps/
│   ├── web/                        # 主站，Next.js 16 App Router
│   └── playground/                 # WebContainer 在线实验场
├── packages/
│   ├── ui/                         # shadcn/ui v4 + Base UI 组件库
│   ├── mdx-components/             # MDX 组件
│   ├── content-config/             # content-collections schema
│   ├── tailwind-config/            # Tailwind v4 共享设计 token
│   ├── tsconfig/                   # 共享 tsconfig
│   └── eslint-config/              # oxlint 共享配置
├── content/                        # 中英文 MDX 教程
├── examples/                       # 10 个实战项目
├── scripts/                        # 内容脚手架与校验脚本
├── PLAN.md                         # 完整内容大纲
└── COMPACT.md                      # 项目上下文压缩文档
```

## 开发

环境要求：

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

常用脚本：

| 命令                    | 用途                        |
| ----------------------- | --------------------------- |
| `pnpm dev`              | 启动主站                    |
| `pnpm dev:playground`   | 启动 WebContainer 实验场    |
| `pnpm build:web`        | 构建主站                    |
| `pnpm build:playground` | 构建实验场                  |
| `pnpm check:content`    | 校验 MDX frontmatter 与规范 |
| `pnpm new:doc`          | 生成新的教程 MDX            |
| `pnpm new:example`      | 生成新的实战项目骨架        |
| `pnpm new:v7note`       | 生成标准 `<V7Note>` 片段    |

## 验收状态

- `pnpm --filter @vite-mastery/web typecheck` 已通过
- `pnpm build:web` 已通过
- `pnpm check:content` 当前 exit code 为 0，但仍保留少量内容质量 warning
- `/` 已固定重定向到 `/en`，不再受旧语言 cookie 或 `Accept-Language` 影响

## 上线前待办

- 核查 Rolldown / Environment API / Vite 8.1.x 相关事实，尤其是 RC API 名称和 hook 行为。
- 校准所有文章的 `readingTime`。
- 为 10 个 examples 补齐更细的 `steps/` 分步代码。
- 接入 Pagefind 索引生成流程，并记录 dev 模式搜索不可用的预期行为。
- 跑 desktop / mobile Lighthouse 和文档页可访问性回归。

## License

MIT
