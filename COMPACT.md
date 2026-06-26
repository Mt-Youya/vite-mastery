# vite-mastery · COMPACT

> 会话压缩文档。新会话开始时读这份，不要读 CLAUDE.md 全文（太长）。
> 最后更新：2026-06-26

---

## 1 · 项目定位

Vite 8 中文系统学习指南。核心差异化：Rolldown 架构、Environment API（RC）、Hooks 深度。以 Vite 8.1.x 为主线，Vite 7 差异用 `<V7Note>` 折叠组件标注。

**线上**：部署到 Vercel，预览 URL 在 GitHub PR 自动触发。

---

## 2 · 技术栈（锁定，不许替换）

| 项     | 值                                                    |
| ------ | ----------------------------------------------------- |
| 框架   | Next.js 16 App Router                                 |
| 语言   | TypeScript 6，strict 全开                             |
| 样式   | Tailwind CSS v4，CSS-first `@theme`                   |
| 包管理 | pnpm + workspaces                                     |
| Lint   | oxlint + oxfmt（禁止 Biome、Prettier）                |
| UI     | shadcn/ui v4 + Base UI (`@base-ui/react`)             |
| 状态   | Zustand                                               |
| 内容   | MDX + `@content-collections/core`                     |
| 高亮   | Shiki v4，双主题（github-light + github-dark-dimmed） |
| 部署   | Vercel                                                |

---

## 3 · Monorepo 结构

```
vite-mastery/
├── apps/
│   ├── web/                        Next.js 16 主站
│   └── playground/                 WebContainer 在线实验场初版
├── packages/
│   ├── ui/                         Base UI + shadcn token 组件库
│   ├── mdx-components/             Callout / CodeBlock / V7Note 等 MDX 组件
│   ├── content-config/             content-collections schema 定义
│   ├── tailwind-config/            设计 token（theme.css / base.css）
│   ├── tsconfig/                   共享 tsconfig 基础配置
│   └── eslint-config/              oxlint 共享配置
├── content/                        79 篇 MDX 教程文章（全部完成）
├── examples/                       10 个实战项目
├── scripts/                        new-doc / new-example / check-content / new-v7note
├── CLAUDE.md                       完整 10 阶段构建指令
├── PLAN.md                         内容大纲（14 章）
└── COMPACT.md                      本文件
```

### apps/web 内部结构

```
apps/web/
├── app/                            Next.js App Router 路由
│   ├── docs/[...slug]/page.tsx     MDX 文档渲染页
│   ├── showcase/                   8 个交互组件 demo 页
│   └── globals.css                 Tailwind 入口 + 暗色主题配置
├── components/
│   ├── layout/                     站点级布局（header/footer/mobile-menu/theme-toggle）
│   ├── docs/                       文档站组件（sidebar/toc/search/pager 等）
│   ├── home/                       首页区块组件
│   └── interactive/                8 个交互式 MDX 组件
├── hooks/                          所有 React hooks（use-sidebar-store/use-active-heading 等）
└── lib/                            纯工具函数和配置（docs-tree/site-config/utils）
```

### packages/ui 内部结构

```
packages/ui/src/
├── components/                     15 个 UI 组件
├── lib/utils.ts                    cn() 工具函数
└── styles/global.css               Tailwind 入口 + @source 声明
```

### packages/mdx-components 内部结构

```
packages/mdx-components/src/
├── components/                     Callout/CodeBlock/V7Note/Steps/Tabs/Diff/Detail 等
├── libs/shiki.ts                   Shiki 高亮器初始化（lib 不是 util，有状态有配置）
└── styles/global.css               @source 声明（让包自己扫描自己的 src）
```

---

## 4 · 内容进度

**79 篇 MDX 全部完成**。14 个 Part + Appendix：

| Part     | 主题                  | 篇数 |
| -------- | --------------------- | ---- |
| 00       | Getting Started       | 4    |
| 01       | Core Concepts         | 4    |
| 02       | Bundler Evolution ⭐  | 5    |
| 03       | Plugin System         | 6    |
| 04       | Hooks Deep Dive ⭐    | 9    |
| 05       | Environment API ⭐ RC | 10   |
| 06       | HMR                   | 6    |
| 07       | Build Pipeline        | 7    |
| 08       | SSR & SSG             | 4    |
| 09       | Framework Integration | 6    |
| 10       | Library Mode          | 3    |
| 11       | Monorepo              | 4    |
| 12       | Performance           | 6    |
| 13       | Real World Plugins    | 4    |
| Appendix | Vite 7→8 迁移指南     | 1    |

**待做**：每篇文章的 `readingTime` 实测校准、所有 `<V7Note>` 内容的事实核查（Rolldown/Env API 部分），`content/appendix/` 迁移指南补充细节。

---

## 5 · 关键技术决策与已知陷阱

### 5.1 Tailwind v4 暗色主题扫描问题（已解决）

**问题**：`packages/ui` 和 `packages/mdx-components` 里的 `dark:bg-*` 等 utility class，Next.js 16 Turbopack 只在 dev server 冷启动时扫一次，运行中修改 packages 文件不触发重扫，导致 dark 模式颜色消失。

**解决方案**（当前生效）：

每个 package 的 `src/styles/global.css` 写：

```css
@import "tailwindcss"; /* 必须有，给 Tailwind 建立处理上下文 */
@source "../**/*.{ts,tsx}"; /* 扫自己的 src */
```

`apps/web/app/globals.css` 用：

```css
@import "@vite-mastery/ui/style.css";
@import "@vite-mastery/mdx-components/style.css";
```

效果：改 packages 文件 → 约 8 秒内新 utility class 自动进 CSS，无需重启 dev server。

**注意**：`@import "tailwindcss"` 不能省，省了 `@source` 会被忽略。两个包都 import 会导致 base reset 轻微重复（约 5 次 `box-sizing`），功能无影响。

### 5.2 dark: 变体特异性（已解决）

`@custom-variant dark (&:where(.dark, .dark *))` 中的 `:where()` 会把特异性归零，导致 `dark:bg-x` 和 base `bg-y` 同特异性，依赖 CSS 源码顺序定胜负，频繁翻车。

**当前配置**：

```css
@custom-variant dark (&:is(.dark *, .dark));
```

`:is()` 特异性 (0,2,0) 稳赢任何 base utility (0,1,0)。

### 5.3 next-themes 暗色模式

`attribute="class"` 模式，切换时在 `<html>` 上加 `.dark` class。Tailwind 的 `dark:` 变体依赖 5.2 的 `@custom-variant` 配置才能正确响应。

### 5.4 Shiki 双主题

`defaultColor: false`，用 CSS 变量 `--shiki-light` / `--shiki-dark`。`globals.css` 里有对应的 `.dark .shiki span` 覆盖规则。

### 5.5 content-collections slug 格式

`content/03-plugin-system/04-virtual-modules-plugin.mdx` → slug = `03-plugin-system/04-virtual-modules-plugin`。路由：`/docs/03-plugin-system/04-virtual-modules-plugin`。

### 5.6 pnpm dev 脚本

根 `dev` 只启 `apps/web`（避免 examples/ssr-with-env-api 抢 :3000 端口）。`dev:all` 才是并行跑所有 workspace。

---

## 6 · 已完成的阶段

| 阶段 | 内容                                    | 状态 |
| ---- | --------------------------------------- | ---- |
| 1    | Monorepo 骨架                           | ✅   |
| 2    | 共享配置包                              | ✅   |
| 3    | Next.js 主站初始化                      | ✅   |
| 4    | 文档站骨架（sidebar/TOC/search/pager）  | ✅   |
| 5    | 8 个交互式 MDX 组件                     | ✅   |
| 6    | 内容写作脚手架（scripts/）              | ✅   |
| 7    | 10 个 examples 目录骨架                 | ✅   |
| 8    | Vercel 部署配置 + CI                    | ✅   |
| 9    | Part 0 + Part 3 前半内容                | ✅   |
| 10   | Part 2 + Part 5 开篇内容                | ✅   |
| 追加 | 全部 79 篇 MDX（Parts 1-13 + Appendix） | ✅   |

---

## 7 · 移动端适配状态

- **Header**：md 以下显示汉堡菜单（`MobileMenu` → Sheet 左划入）、紧凑搜索图标、GitHub 图标、主题切换
- **文档站**：md 以下隐藏左侧 sidebar，正文顶部显示「章节目录」按钮（`MobileSidebar` → Sheet 左划入）
- **首页**：Hero/WhyVite/PartsOverview/ExamplesBento/AuthorIntro/FinalCta 全部有 `px-4 sm:px-6` 响应式 padding
- **Showcase**：`px-4 sm:px-6`，标题 `text-2xl sm:text-3xl`

---

## 8 · 待做清单（优先级排序）

1. **内容质量**：`pnpm check:content` 验证全部 79 篇（目前有 V7Note 内容被误报为正文 Vite 7 写法的 false positive，exit code 0，不阻塞）
2. **搜索索引**：`pnpm build` 后才由 Pagefind 生成 `/_pagefind/`，dev 模式搜索不可用
3. **examples 内容**：10 个实战项目的 `steps/` 分步代码还是空目录
4. **apps/playground**：WebContainer 初版已建成，后续补 HMR / Env API / 双 bundler 模板
5. **OG 图**：`app/opengraph-image.tsx` 存在但未测试渲染效果
6. **性能**：Lighthouse 首屏 performance 目标 ≥ 90，尚未跑过

---

## 9 · 常用命令

```bash
pnpm dev              # 启动 apps/web（:3000）
pnpm dev:web          # 同上
pnpm dev:all          # 并行启动所有 workspace（会有端口冲突，谨慎）
pnpm build:web        # 构建 apps/web
pnpm check:content    # 验证所有 MDX frontmatter 完整性
pnpm new:doc          # 交互式生成新 MDX 文章
pnpm new:example      # 生成新实战项目骨架
pnpm new:v7note       # 生成 <V7Note> 片段
pnpm typecheck        # 全量类型检查
```

---

## 10 · 协作规范（精简版）

- 所有回复用**中文**，代码注释用中文，commit message 用英文
- **不自动 commit**——改完给 diff 摘要，commit 由用户执行
- **绝对不 push**——任何 push / gh pr create 需要当前轮次显式授权
- Vite 8 / Rolldown / Env API 事实不确定 → 停下来问，不猜不编
- 不装新依赖——先列出，等确认
- Part 5 所有文章必须有 `apiStability: "rc"` + RC 警告 Callout
