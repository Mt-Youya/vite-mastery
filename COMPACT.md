# vite-mastery · COMPACT

> 会话压缩文档。新会话开始时读这份，不要读 CLAUDE.md 全文（太长）。
> 最后更新：2026-06-28

---

## 1 · 项目定位

Vite 8 中英双语系统学习指南。核心差异化：Rolldown 架构、Environment API（RC）、Hooks 深度。以 Vite 8.1.x 为主线，Vite 7 差异用 `<V7Note>` 折叠组件标注。支持中英文切换（`/en/*` 默认 / `/zh/*`），无前缀 URL 固定重定向到英文。

**线上**：部署到 Vercel，预览 URL 在 GitHub PR 自动触发。

---

## 2 · 技术栈（锁定，不许替换）

| 项     | 值                                                            |
| ------ | ------------------------------------------------------------- |
| 框架   | Next.js 16 App Router                                         |
| 语言   | TypeScript 6，strict 全开                                     |
| 样式   | Tailwind CSS v4，CSS-first `@theme`                           |
| 包管理 | pnpm + workspaces                                             |
| Lint   | oxlint + oxfmt（禁止 Biome、Prettier）                        |
| UI     | shadcn/ui v4 + Base UI (`@base-ui/react`)                     |
| 状态   | Zustand                                                       |
| 内容   | MDX + `@content-collections/core`                             |
| 高亮   | Shiki v4，双主题（github-light + github-dark-dimmed）         |
| i18n   | next-intl v4，`[lang]` 路由段，EN 默认路由 + ZH 内容 fallback |
| 部署   | Vercel                                                        |

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
├── content/                        79 篇 MDX 教程（.zh.mdx + .en.mdx 双语，100% 覆盖）
├── examples/                       10 个实战项目（含 README.en.md）
├── scripts/                        new-doc / new-example / check-content / new-v7note
├── CLAUDE.md                       完整 10 阶段构建指令
├── PLAN.md                         内容大纲（14 章）
└── COMPACT.md                      本文件
```

### apps/web 内部结构

```
apps/web/
├── app/
│   ├── [lang]/                     ← i18n 根路由段（zh / en）
│   │   ├── layout.tsx              根布局，设 metadataBase，包 NextIntlClientProvider
│   │   ├── opengraph-image.tsx     语言感知 OG 图（ZH/EN 不同文案）
│   │   ├── page.tsx                首页
│   │   ├── about/page.tsx
│   │   ├── playground/page.tsx
│   │   ├── examples/page.tsx
│   │   ├── showcase/               8 个交互组件 demo 页
│   │   └── docs/
│   │       ├── layout.tsx          三栏布局
│   │       ├── page.tsx            文档首页
│   │       └── [...slug]/page.tsx  MDX 渲染页（含 fallback banner）
│   ├── sitemap.ts                  双 locale + hreflang
│   └── robots.ts
├── components/
│   ├── layout/                     header / footer / mobile-menu / lang-switcher / theme-toggle
│   ├── docs/                       sidebar / toc / search / pager / breadcrumb / fallback-banner / version-badge / stability-badge
│   ├── home/                       首页区块
│   └── interactive/                8 个交互式 MDX 组件
├── hooks/
├── i18n/
│   ├── config.ts                   LOCALES / DEFAULT_LOCALE / LOCALE_COOKIE / isLocale()
│   └── request.ts                  getRequestConfig()（next-intl）
├── messages/
│   ├── zh.json                     全站中文 UI copy
│   └── en.json                     全站英文 UI copy
├── lib/
│   ├── docs-tree.ts                pickDocsForLocale() + isFallback 标记
│   ├── i18n-routing.ts             localizedHref() / stripLocaleFromPath()
│   └── site-config.ts              结构化数据（无硬编码中文）
└── proxy.ts                        ← Next.js 16 路由代理（取代 middleware.ts）
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
├── libs/shiki.ts                   Shiki 高亮器初始化
└── styles/global.css               @source 声明
```

---

## 4 · 内容进度

**79 篇 MDX 全部完成，ZH + EN 双语 100% 覆盖。**

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

文件命名规则：`content/03-plugin-system/04-virtual-modules-plugin.zh.mdx` + `.en.mdx`。
10 个实战项目均有 `README.en.md`。

---

## 5 · i18n 架构（2026-06-28 完成）

### 路由

- URL 结构：`/en/*`（默认）/ `/zh/*`
- `proxy.ts`（Next.js 16 proxy 约定，取代 middleware.ts）：无前缀 → 308 重定向到 `DEFAULT_LOCALE`（当前 `en`）
- 不再用 cookie / `Accept-Language` 决定无前缀路径，避免 `/` 被旧语言偏好带到 `/zh`

### Fallback 机制

`pickDocsForLocale(allDocs, locale)` 在 `lib/docs-tree.ts`：

- 优先返回目标 locale 的文档
- 缺失时 fallback 到 `CONTENT_FALLBACK_LOCALE`（当前为 `zh`），标记 `isFallback: true`
- Sidebar 显示 `ZH` 徽章，文档页顶部显示橙色提示 banner（`<FallbackBanner>`）

### content-collections

`packages/content-config/src/index.ts`：从文件名后缀（`.zh.mdx` / `.en.mdx`）派生 `locale` 字段。

### UI copy

`messages/zh.json` 和 `messages/en.json`，通过 next-intl `getTranslations()`（server）/ `useTranslations()`（client）消费。`lib/site-config.ts` 不含硬编码中文。

---

## 6 · 关键技术决策与已知陷阱

### 6.1 Tailwind v4 暗色主题扫描（已解决）

每个 package 的 `src/styles/global.css`：

```css
@import "tailwindcss";
@source "../**/*.{ts,tsx}";
```

`apps/web/app/[lang]/styles/globals.css`：

```css
@import "@vite-mastery/ui/style.css";
@import "@vite-mastery/mdx-components/style.css";
```

改 packages 文件 → 约 8 秒内新 utility class 进 CSS。

### 6.2 dark: 变体特异性（已解决）

```css
@custom-variant dark (&:is(.dark *, .dark));
```

`:is()` 特异性 (0,2,0) 稳赢任何 base utility (0,1,0)，不能用 `:where()`。

### 6.3 next-themes 暗色模式

`attribute="class"`，切换时在 `<html>` 加 `.dark`。依赖 6.2 的 `@custom-variant`。

### 6.4 Shiki 双主题

`defaultColor: false`，CSS 变量 `--shiki-light` / `--shiki-dark`。

### 6.5 content-collections slug 格式

`content/03-plugin-system/04-virtual-modules-plugin.zh.mdx` → slug = `03-plugin-system/04-virtual-modules-plugin`，路由：`/zh/docs/03-plugin-system/04-virtual-modules-plugin`。

### 6.6 next.config.ts 异步包裹顺序

`withContentCollections` 返回 `Promise<Partial<NextConfig>>`，`withNextIntl` 期望 `NextConfig`，需用异步工厂函数：

```ts
export default async function nextConfig() {
  const base = await withContentCollections(config)
  return withNextIntl(base as NextConfig)
}
```

### 6.7 metadataBase 作用域

`opengraph-image.tsx` 必须放在 `app/[lang]/` 内，才能继承 `[lang]/layout.tsx` 设置的 `metadataBase: new URL(SITE.url)`。放在 `app/` 根下会产生 9 次 metadataBase 警告。

### 6.8 Next.js 16 proxy.ts

`middleware.ts` 在 Next.js 16 已废弃，改为 `proxy.ts`，导出函数名必须为 `proxy`（不是 `middleware`）。

### 6.9 pnpm dev 脚本

根 `dev` 只启 `apps/web`（避免 examples 抢 :3000）。`dev:all` 才是并行跑所有 workspace。

---

## 7 · 已完成的阶段

| 阶段   | 内容                                        | 状态 |
| ------ | ------------------------------------------- | ---- |
| 1      | Monorepo 骨架                               | ✅   |
| 2      | 共享配置包                                  | ✅   |
| 3      | Next.js 主站初始化                          | ✅   |
| 4      | 文档站骨架（sidebar/TOC/search/pager）      | ✅   |
| 5      | 8 个交互式 MDX 组件                         | ✅   |
| 6      | 内容写作脚手架（scripts/）                  | ✅   |
| 7      | 10 个 examples 目录骨架                     | ✅   |
| 8      | Vercel 部署配置 + CI                        | ✅   |
| 9      | Part 0 + Part 3 前半内容                    | ✅   |
| 10     | Part 2 + Part 5 开篇内容                    | ✅   |
| 追加 A | 全部 79 篇 MDX（Parts 1–13 + Appendix）     | ✅   |
| 追加 B | 中英文切换（i18n 基础设施 + 100% 翻译覆盖） | ✅   |
| 追加 C | Next.js 16 build warnings 清零              | ✅   |

---

## 8 · 移动端适配状态

- **Header**：md 以下显示汉堡菜单（`MobileMenu` → Sheet 左划入）、紧凑搜索图标、GitHub 图标、主题切换、语言切换
- **文档站**：md 以下隐藏左侧 sidebar，正文顶部显示「章节目录」按钮（`MobileSidebar` → Sheet 左划入）
- **首页**：Hero/WhyVite/PartsOverview/ExamplesBento/AuthorIntro/FinalCta 全部有 `px-4 sm:px-6` 响应式 padding
- **Showcase**：`px-4 sm:px-6`，标题 `text-2xl sm:text-3xl`

---

## 9 · 待做清单（优先级排序）

1. **内容质量审校**：Part 02（Bundler Evolution）和 Part 05（Environment API）事实核查，尤其 Rolldown 性能数字和 Env API RC 接口
2. **搜索索引**：`pnpm build` 后由 Pagefind 生成 `/_pagefind/`，dev 模式搜索不可用
3. **examples 内容**：10 个实战项目的 `steps/` 分步代码还是空目录
4. **apps/playground**：WebContainer 初版已建成，后续补 HMR / Env API / 双 bundler 模板
5. **性能**：Lighthouse 首屏 performance 目标 ≥ 90，尚未跑过

---

## 10 · 常用命令

```bash
pnpm dev              # 启动 apps/web（:3000）
pnpm dev:web          # 同上
pnpm dev:all          # 并行启动所有 workspace（会有端口冲突，谨慎）
pnpm build:web        # 构建 apps/web（217 静态页，0 warning）
pnpm check:content    # 验证所有 MDX frontmatter + EN 翻译覆盖率
pnpm new:doc          # 交互式生成新 MDX（同时生成 .zh.mdx + .en.mdx）
pnpm new:example      # 生成新实战项目骨架
pnpm new:v7note       # 生成 <V7Note> 片段
pnpm typecheck        # 全量类型检查
```

---

## 11 · 协作规范（精简版）

- 所有回复用**中文**，代码注释用中文，commit message 用英文
- **不自动 commit**——改完给 diff 摘要，commit 由用户执行
- **绝对不 push**——任何 push / gh pr create 需要当前轮次显式授权
- Vite 8 / Rolldown / Env API 事实不确定 → 停下来问，不猜不编
- 不装新依赖——先列出，等确认
- Part 5 所有文章必须有 `apiStability: "rc"` + RC 警告 Callout
- 新文章用 `pnpm new:doc` 生成——会自动创建 ZH + EN 双语对
