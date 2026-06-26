# vite-mastery

中文社区第一份「Vite 8 核心机制 + Rolldown + Environment API」的系统化学习指南。

> **目标读者**：有 1~3 年前端经验、用过 Vite 但不懂原理的工程师  
> **核心承诺**：读完能写出生产级 Vite 8 插件，理解 Rolldown 架构、Environment API、HMR 全链路

---

## 内容概览

**79 篇 MDX 教程 · 14 个章节 · 10 个实战项目**

| Part     | 主题                                        | 文章数 |
| -------- | ------------------------------------------- | ------ |
| 00       | Getting Started · 入门铺垫                  | 4      |
| 01       | Core Concepts · 核心概念                    | 4      |
| 02 ⭐    | Bundler Evolution · esbuild→Rolldown 演进史 | 5      |
| 03       | Plugin System · 插件系统                    | 6      |
| 04 ⭐    | Hooks Deep Dive · Hooks 时序与源码导读      | 9      |
| 05 ⭐    | Environment API · 多环境隔离（RC 阶段）     | 10     |
| 06       | HMR · 热更新全链路                          | 6      |
| 07       | Build Pipeline · 生产构建管道               | 7      |
| 08       | SSR & SSG                                   | 4      |
| 09       | Framework Integration · 多框架集成          | 6      |
| 10       | Library Mode · 库模式                       | 3      |
| 11       | Monorepo 工程化                             | 4      |
| 12       | Performance · 性能优化                      | 6      |
| 13       | Real World Plugins · 真实插件源码导读       | 4      |
| Appendix | Vite 7 → 8 迁移指南                         | 1      |

---

## 仓库结构

```
vite-mastery/
├── apps/
│   ├── web/                        # 主站（Next.js 16 App Router）
│   └── playground/                 # WebContainer 在线实验场
├── packages/
│   ├── ui/                         # shadcn/ui v4 + Base UI 组件库
│   ├── mdx-components/             # MDX 组件（Callout/CodeBlock/V7Note 等）
│   ├── content-config/             # content-collections schema
│   ├── tailwind-config/            # Tailwind v4 共享设计 token
│   ├── tsconfig/                   # 共享 tsconfig
│   └── eslint-config/             # oxlint 共享配置
├── content/                        # 79 篇 MDX 教程
├── examples/                       # 10 个实战项目（可独立 clone 运行）
├── scripts/                        # new-doc / check-content / new-v7note
├── PLAN.md                         # 完整内容大纲
├── CLAUDE.md                       # 构建阶段指令（10 阶段）
└── COMPACT.md                      # 会话压缩文档（给 AI 续写用）
```

---

## 开发

**环境要求**：Node 24+、pnpm 11+

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动主站（localhost:3000）
pnpm build:web        # 构建主站
pnpm typecheck        # 全量类型检查
pnpm lint             # oxlint 检查
pnpm check:content    # 验证所有 MDX frontmatter 完整性
pnpm new:doc          # 交互式生成新 MDX 文章
pnpm new:example      # 生成新实战项目骨架
```

---

## 完成进度

### 基础设施（10 阶段全部完成）

- [x] 阶段 1 · Monorepo 骨架（pnpm workspace + 目录结构）
- [x] 阶段 2 · 共享配置包（tsconfig / tailwind / ui / content-config）
- [x] 阶段 3 · Next.js 主站（App Router + 首页 + MDX 管线）
- [x] 阶段 4 · 文档站骨架（sidebar / TOC / 搜索 / 面包屑 / 版本徽章）
- [x] 阶段 5 · 8 个交互式 MDX 组件（HookExplorer / BundlerCompare / V7Note 等）
- [x] 阶段 6 · 内容写作脚手架（scripts/ + PR 模板 + sitemap）
- [x] 阶段 7 · 10 个实战项目目录骨架（可独立 `pnpm dev`）
- [x] 阶段 8 · 部署配置（Vercel + CI/CD + robots + OG 图）
- [x] 阶段 9 · 首批内容（Part 0 + Part 3 前半）
- [x] 阶段 10 · 独家内容（Part 2 Bundler Evolution + Part 5 Environment API）

### 内容（全部完成）

- [x] 79 篇 MDX 教程全部完成（Parts 00–13 + Appendix）
- [x] 全站移动端适配（响应式 header / 文档侧边栏抽屉）
- [x] Dark mode 完整支持（Tailwind v4 @custom-variant + 跨包扫描方案）

### 待完善

#### P0 · 上线前验收

- [ ] 跑完 `pnpm check:content`，处理 13 条 `<V7Note>` 相关 warning（目前 exit code 0，不阻塞构建）
- [ ] 校准 79 篇文章的 `readingTime`，从估算值改成按正文长度计算的稳定值
- [ ] 核查 Rolldown / Environment API / Vite 8.1.x 相关事实，尤其是 RC API 名称、hook 行为和迁移表述
- [ ] 补充 `content/appendix/vite-7-to-8-migration.mdx` 的迁移细节与代码片段

#### P1 · 产品体验

- [ ] Pagefind 搜索索引接入上线流程：`pnpm build:web` 后生成 `/_pagefind/`，并在 README 说明 dev 模式不可用是预期行为
- [ ] 验证 `apps/web/app/opengraph-image.tsx` 的渲染效果，补齐默认 OG 预览截图
- [ ] 跑 desktop / mobile Lighthouse，确认首屏 performance ≥ 90，并记录首次构建耗时
- [ ] 完善文档页可访问性回归：TOC 锚点、sidebar 折叠状态、`cmd+k` 搜索弹窗、暗色模式代码块

#### P2 · 实战项目

- [ ] 填充 10 个 `examples/*/steps/` 分步代码，目前多数还是空目录
- [ ] 给每个 example 增加最小验收命令，确保可以独立 `pnpm install && pnpm dev`
- [ ] `plugin-rollup-rolldown-compat` 同时跑通 Vite 7 + `rolldown-vite` 与 Vite 8
- [ ] `env-api-rsc-demo` 补充 RC 风险说明和版本锁定验证

#### P3 · 后续扩展

- [x] 建设 `apps/playground/` WebContainer 在线实验场初版（内置 Vite 8 虚拟模块插件示例）
- [ ] 扩展 `apps/playground/` 模板库：HMR 协议、Environment API、Rollup/Rolldown 兼容插件
- [ ] 为交互式组件补充更多 showcase 截图或录屏，方便 README 展示站点特色
- [ ] 记录已知工程债：当前全量 `pnpm typecheck` 会被 `examples/monorepo-template` 的 `turbo.json` 缺失阻塞，需要补齐或调整该 example 的脚本

---

## 技术亮点

- **Tailwind v4 跨包扫描**：packages 内自声明 `@source`，apps/web 通过 `@import "@vite-mastery/ui/style.css"` 引入，改 packages 文件 ~8s 内 utility class 自动进 CSS，无需重启 dev server
- **`<V7Note>` 折叠组件**：所有 Vite 7 差异点用统一组件折叠，不污染正文
- **Shiki twoslash**：代码块 hover 展示 TypeScript 类型推断
- **content-collections**：MDX frontmatter 强类型校验（viteVersion / apiStability 必填）

---

## License

MIT
