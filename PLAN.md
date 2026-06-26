# Vite 学习指南网站 · 项目规划文档 v2

> **项目代号**:`vite-mastery`(暂定)
> **定位**:中文社区第一份「Vite 8 核心机制 + Rolldown + Environment API」的系统化学习指南
> **目标读者**:有 1~3 年前端经验、用过 Vite 但不懂原理的工程师
> **核心承诺**:读完能写出生产级 Vite 插件,理解 Rolldown 架构、Environment API、HMR 全链路
> **版本**:v2(2026-06-25,根据 Vite 8 实际发布情况重写)

---

## 一、项目定位与差异化

### 1.1 重要时间线(确认事实)

| 时间          | 事件                        | 影响                                                                                                                                |
| ------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 2025-06       | **Vite 7** 发布             | 新增 `buildApp` hook;默认 target 切到 `baseline-widely-available`;Rolldown 通过 `rolldown-vite` 实验性提供                          |
| 2025-12       | Vite 8 beta(Rolldown 集成)  | 早期采用者迁移                                                                                                                      |
| **2026-03**   | **Vite 8 稳定版**发布       | **Rolldown 成为唯一 bundler**,替换 esbuild + Rollup;`@vitejs/plugin-react` v6 改用 Oxc;内置 Devtools;CSS minifier 切到 lightningcss |
| 2026-06(现在) | Vite 8.1.x 是 current minor | Vite 7.3 接收重要修复;Vite 6.4 仅安全补丁                                                                                           |

### 1.2 双版本策略(确认版)

**以 Vite 8 为主线,Vite 7 差异点用折叠组件 `<V7Note>` 标注。**

- 主线内容默认讲 Vite 8 / Rolldown 行为
- 凡是 Vite 7 与 Vite 8 行为不同的地方,正文末尾插一个 `<V7Note>` 折叠块
- 折叠块内容:旧行为是什么、为什么改、迁移路径
- 全站统一,不写"两遍"——避免分裂

> 这个策略的依据:Vite 8 已发布 3 个多月,生态主流框架(Nuxt/SvelteKit/Astro/React Router/Storybook)都已适配。Vite 7 的角色变成"上一代",但仍有大量存量用户,需要兼顾。

### 1.3 现有中文教程的问题

中文社区的 Vite 教程绝大多数停留在 Vite 5 时代:配置 `vite.config.ts`、调 plugin 选项、跑 build。普遍没讲清的关键点:

- **为什么 Vite 8 要换 Rolldown?** 双引擎架构的痛点是什么?
- **Environment API 到底解决什么问题?** 不是 SSR API 的升级版,是模型本身的重塑。
- **Rolldown 插件 vs Rollup 插件 vs Vite 插件**三者关系
- **HMR 协议**底层用什么消息格式通信
- Hooks(`resolveId` / `load` / `transform` / `handleHotUpdate` 等)在 Rolldown 下的触发时机变化

**本站只做一件事**:把这些"黑盒"全部拆开讲清楚,顺便把 Vite 8 的新概念彻底吃透。

### 1.4 内容主轴(根据新事实重新设计)

```
                  ┌───────────────────────────────┐
                  │  主轴:Vite 8 核心机制          │
                  │  (Rolldown + Hooks + 插件 +    │
                  │   Environment API + HMR)       │
                  └────────────┬──────────────────┘
                               │
       ┌───────────────────┬───┴────┬──────────────────┐
       │                   │        │                  │
   辅助场景 1          辅助场景 2    辅助场景 3       辅助场景 4
   多框架集成         库模式构建    Monorepo 工程化   性能优化
   (React/Vue/         (跨框架      (类似本站        (Rolldown 调优
    Svelte/Solid)      组件库)      结构)            + HMR 诊断)
       │                   │        │                  │
       └───────────────────┴────────┴──────────────────┘
```

主轴权重 ≈ 65%(主轴比 v1 还重,因为加入了 Environment API)。

### 1.5 与官方文档的关系

官方文档是「参考手册」,本站是「教学路径 + 中文化深度解读」。本站补充:

- 中文化的概念脉络
- 真实场景的代码示例
- 从零到一的实战项目
- Hooks 触发时机时序图(官方没有图)
- Rolldown vs Rollup vs Vite 三者关系梳理(官方分散在多处)

---

## 二、技术栈(锁定)

| 层          | 技术                                                               | 备注                                   |
| ----------- | ------------------------------------------------------------------ | -------------------------------------- |
| 框架        | **Next.js 16** (App Router)                                        | 主站,SSG + ISR                         |
| 语言        | **TypeScript 6**                                                   | strict 全开                            |
| 样式        | **Tailwind CSS v4**                                                | CSS-first `@theme`,不用 JS 配置        |
| UI 底座     | **shadcn/ui v4** + **Base UI** (`@base-ui/react`)                  | React 站点强制 Base UI 作为 primitive  |
| 状态        | **Zustand**                                                        | 仅用于交互式 demo;文档站本身几乎不需要 |
| 包管理      | **pnpm** + workspaces                                              | Node 22+                               |
| Lint/Format | **oxc** (oxlint + oxfmt)                                           | **禁用 Biome**                         |
| 内容        | **MDX** + `@content-collections/core`                              | App Router 友好                        |
| 代码高亮    | **Shiki**(带 twoslash)                                             | TS 类型 hover 提示                     |
| 图表        | **Mermaid** + Excalidraw 静态图                                    | 时序图、架构图                         |
| 部署        | **Vercel**                                                         | 自动 preview                           |
| 设计 skill  | impeccable / taste-skill / gpt-taste / baseline-ui / ui-ux-pro-max | 见 §七                                 |

**Vite 演示代码的版本基线**:文档示例统一基于 **Vite 8.1.x**,在每篇文章 frontmatter 声明 `viteVersion: "8.1"`。

**显式排除**:Biome、Webpack、CRA、Yarn、npm(作为主包管理器)、Vite 6 及更早版本(只在历史章节提及)。

---

## 三、Monorepo 结构(沿用 v1 的混合结构)

```
vite-mastery/
├── apps/
│   ├── web/                      # 主站(Next.js 16)
│   └── playground/               # 在线交互式 demo(WebContainer / Sandpack)
│
├── packages/
│   ├── ui/                       # shadcn + Base UI 共享组件库
│   ├── mdx-components/           # 自定义 MDX 组件
│   ├── content-config/           # content-collections 配置
│   ├── tailwind-config/          # Tailwind v4 共享主题
│   ├── tsconfig/                 # 共享 tsconfig
│   └── eslint-config/            # oxlint 共享配置
│
├── content/                      # 所有教程 MDX
│   ├── 00-getting-started/
│   ├── 01-core-concepts/
│   ├── 02-bundler-evolution/     # ← v2 新章:Rolldown 架构
│   ├── 03-plugin-system/         # ← 主轴
│   ├── 04-hooks-deep-dive/       # ← 主轴
│   ├── 05-environment-api/       # ← v2 新章,独立 Part
│   ├── 06-hmr/                   # ← 主轴
│   ├── 07-build-pipeline/
│   ├── 08-ssr-ssg/
│   ├── 09-framework-integration/
│   ├── 10-library-mode/
│   ├── 11-monorepo/
│   ├── 12-performance/
│   ├── 13-real-world-plugins/
│   └── appendix/
│       └── vite-7-to-8-migration.mdx  # ← 单独的迁移指南
│
├── examples/                     # 实战项目
│   ├── plugin-virtual-modules/
│   ├── plugin-md-loader/
│   ├── plugin-i18n/
│   ├── plugin-image-optimizer/
│   ├── plugin-rollup-rolldown-compat/  # ← v2 新增:双 bundler 兼容插件
│   ├── env-api-rsc-demo/               # ← v2 新增:Env API 实战
│   ├── ssr-with-env-api/
│   ├── library-mode-demo/
│   ├── monorepo-template/
│   └── plugin-auto-import/
│
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

**v2 与 v1 的关键差异**:

1. `content/` 多了一个 **Part 2 Bundler Evolution**(讲历史 + Rolldown 架构)
2. `content/` 多了一个 **Part 5 Environment API**(独立大章)
3. `content/appendix/` 放迁移指南(独立路由 `/appendix/vite-7-to-8-migration`)
4. `examples/` 多了 **`plugin-rollup-rolldown-compat`** 和 **`env-api-rsc-demo`**

---

## 四、内容大纲(14 个章节,v2 重写)

> 标 ⭐ 的是主轴,标 🆕 的是 v2 相对 v1 新增的内容。

### Part 0 · Getting Started(入门铺垫)

| 节  | 标题                         | 重点                                |
| --- | ---------------------------- | ----------------------------------- |
| 0.1 | 为什么需要 Vite              | Webpack 时代的痛、Vite 8 时代的承诺 |
| 0.2 | 五分钟跑通第一个 Vite 8 项目 | `pnpm create vite@latest`           |
| 0.3 | 项目结构与配置文件解剖       | `vite.config.ts` 每个字段           |
| 0.4 | 本指南怎么读                 | 学习路径推荐 + Vite 7/8 标注约定    |

### Part 1 · Core Concepts(核心概念)

| 节  | 标题                         | 重点                               |
| --- | ---------------------------- | ---------------------------------- |
| 1.1 | Native ESM 与浏览器原生模块  | `<script type="module">` 边界      |
| 1.2 | Vite 8 的统一架构(Rolldown)  | 对比 Vite 5/6/7 的双引擎           |
| 1.3 | 依赖预构建(Dep Pre-Bundling) | Rolldown 接管后的变化              |
| 1.4 | Module Graph 模块图          | Environment API 下的"分环境模块图" |

### Part 2 · Bundler Evolution(Bundler 演进史 🆕)⭐

> 这一章是 v2 的独创内容。把 Vite 的 bundler 历史讲清楚——这是中文社区目前最缺的内容。

| 节  | 标题                                            | 重点                                   |
| --- | ----------------------------------------------- | -------------------------------------- |
| 2.1 | esbuild + Rollup 的双引擎遗产                   | 为什么 Vite 早期这么设计、双引擎的痛点 |
| 2.2 | Rolldown 是什么                                 | Rust + Rollup 兼容 API + 性能数据      |
| 2.3 | Rolldown 架构剖析                               | OXC 解析、并行处理、增量缓存           |
| 2.4 | 插件 API 兼容层                                 | Rollup 插件如何在 Rolldown 上运行      |
| 2.5 | 实战项目 5:写一个 Rollup/Rolldown 双兼容插件 🆕 | 让插件同时支持两个 bundler             |

### Part 3 · Plugin System(插件系统)⭐

| 节  | 标题                                      | 重点                                           |
| --- | ----------------------------------------- | ---------------------------------------------- |
| 3.1 | Vite 插件 vs Rolldown 插件 vs Rollup 插件 | 三者关系图                                     |
| 3.2 | 插件结构剖析                              | `name` / `enforce` / `apply`                   |
| 3.3 | 插件执行顺序                              | `pre` / 默认 / `post` 在 Rolldown 下的时序     |
| 3.4 | 实战项目 1:虚拟模块插件                   |                                                |
| 3.5 | 插件间通信                                | `this.meta` / 共享状态                         |
| 3.6 | 调试插件                                  | 内置 **Devtools**(Vite 8 新增)+ `DEBUG=vite:*` |

### Part 4 · Hooks Deep Dive(Hooks 深度解析)⭐

> 全站最重的一章。每个 hook 配时序图 + 真实代码示例。

| 节  | 标题                                     | Hook 覆盖                                                   |
| --- | ---------------------------------------- | ----------------------------------------------------------- |
| 4.1 | Hooks 全景图                             | 通用 hooks vs Vite-only hooks vs Rolldown 扩展 hooks        |
| 4.2 | 构建期通用 hooks (上)                    | `options` / `buildStart` / `resolveId` / `load`             |
| 4.3 | 构建期通用 hooks (下)                    | `transform` / `buildEnd` / `generateBundle` / `writeBundle` |
| 4.4 | Vite 独有 hooks (上)                     | `config` / `configResolved` / `configureServer`             |
| 4.5 | Vite 独有 hooks (下)                     | `transformIndexHtml` / `handleHotUpdate`                    |
| 4.6 | Environment 相关 hook                    | `buildApp`(Vite 7+ 新增,Vite 8 主流化)                      |
| 4.7 | Hook 在 Rolldown vs Rollup 的行为差异 🆕 | 何时一致、何时不同                                          |
| 4.8 | 实战项目 2:Markdown 加载器               | `load` + `transform` 把 `.md` 变组件                        |
| 4.9 | 实战项目 3:i18n 自动注入                 | `transformIndexHtml` + `resolveId` 组合                     |

### Part 5 · Environment API(独立大章 🆕)⭐

> 这是 v2 最大的新增。Environment API 是 Vite 6 引入、Vite 7 演进、Vite 8 接近稳定的核心 API。中文社区目前几乎没有系统教程。

| 节   | 标题                                                    | 重点                                    |
| ---- | ------------------------------------------------------- | --------------------------------------- |
| 5.1  | 为什么需要 Environment API                              | Vite 5 时代 `ssrLoadModule` 的局限      |
| 5.2  | 核心概念:Environment、ModuleRunner、HotChannel          | 三件套                                  |
| 5.3  | 默认环境 client vs ssr                                  | 怎么区分、怎么访问                      |
| 5.4  | 自定义环境                                              | 为 Cloudflare Workers / Edge 写一个环境 |
| 5.5  | DevEnvironment vs BuildEnvironment                      | 开发态 vs 构建态                        |
| 5.6  | ModuleRunner 深入                                       | 跨 runtime 执行模块的机制               |
| 5.7  | RunnableDevEnvironment vs FetchableDevEnvironment       | 两种通信模型                            |
| 5.8  | `buildApp` hook 实战                                    | 协调多环境构建                          |
| 5.9  | 框架视角:Nuxt / SvelteKit / React Router 怎么用 Env API | 真实案例拆解                            |
| 5.10 | 实战项目 6:用 Env API 实现 RSC-like 多环境构建 🆕       | 综合性实战                              |

### Part 6 · HMR(热更新)⭐

| 节  | 标题                                | 重点                                      |
| --- | ----------------------------------- | ----------------------------------------- |
| 6.1 | HMR 协议:WebSocket 通信             | client ↔ server 消息格式                  |
| 6.2 | `import.meta.hot` API 全解          | `accept` / `dispose` / `invalidate`       |
| 6.3 | `handleHotUpdate` hook              | 自定义 HMR 行为                           |
| 6.4 | Environment 下的 HMR(HotChannel) 🆕 | 每个环境独立的 hot channel                |
| 6.5 | 框架的 HMR 怎么做                   | React Refresh(Oxc 实现)/ Vue HMR 源码节选 |
| 6.6 | 实战:为自定义文件类型实现 HMR       | `.yaml` 配置热更                          |

### Part 7 · Build Pipeline(生产构建)

| 节  | 标题                                     | 重点                                                 |
| --- | ---------------------------------------- | ---------------------------------------------------- |
| 7.1 | Rolldown 在 Vite 8 中的角色              | 替代 Rollup 后的变化                                 |
| 7.2 | Asset Pipeline                           | `?url` `?raw` `?inline` 在 Rolldown 下               |
| 7.3 | CSS 处理                                 | **lightningcss**(Vite 8 默认)/ PostCSS / CSS Modules |
| 7.4 | 代码分割与 chunk 策略                    | Rolldown 更灵活的 chunk splitting                    |
| 7.5 | 默认 target:baseline-widely-available 🆕 | 浏览器兼容性新模型                                   |
| 7.6 | Module Federation(Rolldown 解锁)🆕       | 概念介绍                                             |
| 7.7 | 实战项目 4:图片优化插件                  | 集成 sharp,生成 webp/avif                            |

### Part 8 · SSR & SSG

| 节  | 标题                            | 重点                           |
| --- | ------------------------------- | ------------------------------ |
| 8.1 | Vite 8 时代的 SSR API           | 基于 Environment API 的新模型  |
| 8.2 | 实战项目 7:手写 SSR(用 Env API) | 不用任何框架,纯 Vite + Express |
| 8.3 | SSG 静态生成模式                | 路由收集与渲染                 |
| 8.4 | Wasm SSR(Vite 8 新增)🆕         | 在 SSR 环境中运行 Wasm         |

### Part 9 · Framework Integration(框架集成)

| 节  | 标题                       | 备注                                                    |
| --- | -------------------------- | ------------------------------------------------------- |
| 9.1 | React + Vite 8             | **`@vitejs/plugin-react` v6**(Oxc Refresh,告别 Babel)🆕 |
| 9.2 | Vue + Vite 8               | 单文件组件编译流程                                      |
| 9.3 | Svelte + Vite              | Svelte preprocessor                                     |
| 9.4 | Solid + Vite               | `vite-plugin-solid`                                     |
| 9.5 | Meta 框架对比              | Next / Nuxt / SvelteKit / SolidStart                    |
| 9.6 | React Compiler 怎么接入 🆕 | `reactCompilerPreset` + `@rolldown/plugin-babel`        |

### Part 10 · Library Mode(库模式)

| 节   | 标题                        | 重点                       |
| ---- | --------------------------- | -------------------------- |
| 10.1 | `build.lib` 配置全解        | entry / formats / external |
| 10.2 | 类型声明文件生成            | `vite-plugin-dts`          |
| 10.3 | 实战项目 8:发布跨框架组件库 | 一次构建,产出 ESM/CJS/UMD  |

### Part 11 · Monorepo 工程化

| 节   | 标题                         | 重点                      |
| ---- | ---------------------------- | ------------------------- |
| 11.1 | pnpm workspace 基础          | `workspace:*` 协议        |
| 11.2 | Vite + Monorepo 的坑         | 依赖预构建跨包问题        |
| 11.3 | 实战项目 9:复刻本站 Monorepo | apps + packages + content |
| 11.4 | Turborepo 任务编排           | 缓存策略                  |

### Part 12 · 性能优化

| 节   | 标题                       | 重点                                  |
| ---- | -------------------------- | ------------------------------------- |
| 12.1 | 冷启动优化                 | `optimizeDeps` 调优 + Rolldown 预构建 |
| 12.2 | Vite 8 Devtools 实战 🆕    | 内置 devtools 的用法                  |
| 12.3 | HMR 性能诊断               | `--debug hmr`                         |
| 12.4 | Bundle 分析                | Rolldown 兼容的 analyzer              |
| 12.5 | Full Bundle Mode(实验性)🆕 | Vite 8 后续路线图                     |
| 12.6 | Tree-shaking 实战          | sideEffects 标注                      |

### Part 13 · 真实世界的 Vite 插件赏析

| 节   | 标题                                  | 重点         |
| ---- | ------------------------------------- | ------------ |
| 13.1 | `unplugin-auto-import` 源码导读       |              |
| 13.2 | `vite-plugin-pages` 源码导读          | 文件路由实现 |
| 13.3 | `@vitejs/plugin-react` v6 源码导读 🆕 | Oxc 集成内幕 |
| 13.4 | 实战项目 10:复刻 auto-import 简化版   | 综合应用     |

### Appendix · Vite 7 → 8 迁移指南 🆕

独立路由 `/appendix/vite-7-to-8-migration`,单页 long-form:

- 升级前 checklist
- 配置变更对照表(esbuild options → Rolldown options 自动转换)
- 插件兼容性自查清单
- 常见迁移坑(`@vitejs/plugin-react` v5 → v6)
- 渐进迁移路径:Vite 7 + `rolldown-vite` 包 → Vite 8

---

## 五、十个实战项目(v2 更新)

| #     | 项目                                 | 涉及章节 | 难度     | 产出                    |
| ----- | ------------------------------------ | -------- | -------- | ----------------------- |
| 1     | 虚拟模块插件                         | 3.4      | ⭐       | 一个 npm 包雏形         |
| 2     | Markdown 加载器                      | 4.8      | ⭐⭐     | 可发布的 loader         |
| 3     | i18n 自动注入                        | 4.9      | ⭐⭐     | 实用工具插件            |
| 4     | 图片优化插件(sharp 集成)             | 7.7      | ⭐⭐⭐   | 生产级插件              |
| **5** | **Rollup/Rolldown 双兼容插件** 🆕    | **2.5**  | ⭐⭐⭐   | **能跨 bundler 的插件** |
| **6** | **Env API + RSC-like 多环境构建** 🆕 | **5.10** | ⭐⭐⭐⭐ | **独家硬核内容**        |
| 7     | 手写 SSR(Env API 版本)               | 8.2      | ⭐⭐⭐   | 完整 SSR 应用           |
| 8     | 跨框架组件库                         | 10.3     | ⭐⭐⭐   | 可发布的 UI 库          |
| 9     | Monorepo 工程化模板                  | 11.3     | ⭐⭐     | 脚手架模板              |
| 10    | 简化版 auto-import                   | 13.4     | ⭐⭐⭐⭐ | 综合性插件              |

每个项目固定结构:

```
examples/<project-name>/
├── README.md          # 项目目标 / 学习要点 / 步骤拆解
├── steps/             # 分步代码(step-01, step-02, ...)
├── final/             # 完成版
└── package.json       # 独立,Vite 8 依赖
```

---

## 六、`<V7Note>` 折叠组件设计

正文统一以 Vite 8 为准,Vite 7 差异点用专门的 MDX 组件标注。

### 组件 API

```mdx
<V7Note title="Vite 7 行为差异">
在 Vite 7 中,该 hook 的执行顺序是 ... 而不是 Vite 8 的 ...

如需在 Vite 7 上达到同样效果,请使用 `rolldown-vite` 包。

</V7Note>
```

### 视觉设计(交给 ui-ux-pro-max skill)

- 折叠态:一行 hint,左侧 Vite 7 logo 灰度图标,右侧展开箭头
- 展开态:橙色边框、Vite 7 标识、内容区
- 暗色模式适配
- 可达性:Tab 可达,Enter/Space 展开

### 使用规则

- **只在行为真正不同时使用**,不滥用
- 内容必须包含:旧行为 / 为什么改 / 迁移路径
- 每章不超过 5 个 `<V7Note>`,超过说明该章 Vite 7 差异太大,要单独写章节

### 全站频度预估

| 章节                     | 预计 `<V7Note>` 数量      |
| ------------------------ | ------------------------- |
| Part 2 Bundler Evolution | 6~8(差异最大)             |
| Part 3 Plugin System     | 2~3                       |
| Part 4 Hooks             | 4~5                       |
| Part 5 Environment API   | 3~4                       |
| Part 6 HMR               | 1~2                       |
| Part 9 框架集成          | 2~3(plugin-react v5 → v6) |
| 其他                     | 0~1                       |

---

## 七、设计 Skill 应用分工

| Skill             | 应用场景                                                                                                  | 触发位置                   |
| ----------------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| **impeccable**    | 营销页:首页 Hero、Features、CTA、Footer                                                                   | `apps/web/app/page.tsx`    |
| **taste-skill**   | 营销页强化:作者介绍、案例展示、订阅区                                                                     | 首页次级板块               |
| **gpt-taste**     | 文档内容页版式细节:字号节奏、行高、引用块、代码块装饰                                                     | `apps/web/app/docs/*`      |
| **baseline-ui**   | 文档骨架:左侧 sidebar、右侧 TOC、面包屑、搜索框、上一篇/下一篇                                            | 文档站 layout              |
| **ui-ux-pro-max** | 交互式组件:Playground、Hook 时序图、插件可视化、HMR 演示、**`<V7Note>` 折叠组件**、**Bundler 架构对比图** | `packages/mdx-components/` |

**调用顺序**(从抽象到具体):

1. **baseline-ui** 出整站骨架
2. **ui-ux-pro-max** 精修高交互组件
3. **impeccable** + **taste-skill** 处理营销页
4. **gpt-taste** 调文档版式细节

---

## 八、React 站点的 Base UI 约束

题主明确要求 React 部分用 **Base UI**(`@base-ui/react`)。落地方式:

- shadcn/ui 默认 primitive 是 Radix,本项目**全部替换为 Base UI 等价组件**
- `packages/ui/` 下重写 Button / Dialog / Popover / Select / Tabs / Tooltip 等基础组件,底层用 Base UI
- 文档站所有 React 交互组件(`<HookExplorer />` `<PluginPipeline />` `<HmrDemo />` `<V7Note />`)的可访问性原语全部来自 Base UI

Base UI 版本基线在 `packages/ui/README.md` 标注。

---

## 九、教学风格规约(写作严格遵守)

1. **每节都有「你将学到什么」** —— 列 3~5 个可量化的学习目标
2. **每节都有「前置知识」** —— 明确依赖
3. **每节标注 `viteVersion` frontmatter** —— 示例代码基线版本
4. **代码示例必须可运行** —— 给完整文件,不给片段
5. **每节末尾有「自测题」** —— 3~5 道概念题 + 1 道编码题
6. **每章末尾有「实战项目链接」** —— 引导去 `examples/`
7. **概念引入用「问题驱动」** —— 先抛出场景,再讲方案
8. **专有名词中英对照** —— 比如「依赖预构建 (Dependency Pre-Bundling)」
9. **Vite 7 差异用 `<V7Note>`** —— 不混入正文
10. **不写废话** —— 不要"在本章中我们将讨论..."这种开场白

---

## 十、部署与基础设施

| 项              | 方案                                               |
| --------------- | -------------------------------------------------- |
| 主站部署        | Vercel,`apps/web` 为根                             |
| Playground 部署 | Vercel 单独 project,或嵌入 StackBlitz iframe       |
| 域名            | 待定(可考虑 `vite-mastery.dev` / `vite.yonjay.me`) |
| CDN             | Vercel Edge Network 默认                           |
| 评论            | Giscus(GitHub Discussions)                         |
| 搜索            | Pagefind(静态搜索,无后端依赖)                      |
| 分析            | Vercel Analytics + Umami(自托管,可选)              |

---

## 十一、里程碑(v2 调整)

| 阶段                           | 周期   | 产出                                                                 |
| ------------------------------ | ------ | -------------------------------------------------------------------- |
| M1 · 基础设施                  | 1 周   | Monorepo 骨架 + Next.js 站点 + MDX 渲染管线 + 部署 + `<V7Note>` 组件 |
| M2 · 核心内容(基础)            | 3~4 周 | Part 0~1 + Part 3(插件系统)                                          |
| M3 · 核心内容(Bundler + Hooks) | 3~4 周 | **Part 2 Bundler Evolution** + Part 4 Hooks + 实战项目 1~3, 5        |
| M4 · 独家内容(Env API)         | 2~3 周 | **Part 5 Environment API** + 实战项目 6                              |
| M5 · HMR + 构建                | 2 周   | Part 6 HMR + Part 7 Build + 实战项目 4                               |
| M6 · 应用层                    | 2~3 周 | Part 8~10 + 实战项目 7~8                                             |
| M7 · 收尾                      | 2 周   | Part 11~13 + 实战项目 9~10 + Appendix 迁移指南 + SEO                 |

总计 ≈ **14~17 周**(比 v1 多 4 周,主要在 Part 2 + Part 5)。

---

## 十二、风险与开放问题

1. **Environment API 仍在 RC 阶段**:`transformRequest` 等 API 名称可能在未来 minor 中变化。需在每篇 Env API 文章顶部标注 `apiStability: rc`,并约定:
   - RC API 变化时,通过 `git diff` 标注变更范围
   - 提供 codemod 脚本(`scripts/migrate-env-api.ts`)
2. **Rolldown 本身还在演进**:某些 advanced features(如 minification)还在 alpha。文章里要明确标注哪些是稳定能力、哪些是实验能力。
3. **Base UI 文档不完整**:某些组件可能需要读源码补 props 表
4. **Content Collections 在 Next.js App Router 下的表现**:需在 M1 阶段做技术验证
5. **Playground 方案选型**:Sandpack vs StackBlitz WebContainer,需在 M1 决定
6. **`@vitejs/plugin-react` v5 vs v6**:v5 仍兼容 Vite 8,但默认推荐 v6。教学示例必须明确版本
7. **Rolldown plugin API 与 Rollup 100% 兼容吗?**:官方说"几乎"。实战项目 5 就是用来摸清边界的
8. **是否要英文版**:目录结构已为 i18n 留出空间,但首发只做中文

---

## 十三、关键事实速查(给写作时引用)

> 这些是 v2 写作时反复用到的事实,集中在这里,避免每篇文章重新查。

### Vite 8 关键事实

- 发布日期:**2026-03-12**
- Bundler:**Rolldown**(替代 esbuild + Rollup)
- CSS minifier:**lightningcss**(普通依赖,不再是 optional peer)
- Devtools:**内置** `devtools` 选项
- Node 要求:**20.19+ / 22.12+**(同 Vite 7)
- 默认 target:**`baseline-widely-available`**(从 Vite 7 起)
- 性能:**10~30x 更快构建**;Linear 报告 46s → 6s
- 安装包体积:比 Vite 7 大约 **+15 MB**(~10 MB lightningcss + ~5 MB Rolldown)
- 实验性:Full Bundle Mode、Raw AST transfer、Native MagicString transforms
- 配套:`@vitejs/plugin-react` **v6**(Oxc Refresh)

### Vite 7 关键事实

- 发布日期:**2025-06-24**
- Bundler:esbuild + Rollup(传统双引擎)
- Rolldown:通过 `rolldown-vite` 包实验性提供
- 新增 hook:**`buildApp`**
- 默认 target:**`baseline-widely-available`**(从 Vite 7 开始)
- Node 要求:**20.19+ / 22.12+**
- 状态:7.3.x 维护中,接收重要修复(2026-06)

### 版本支持范围(2026-06 时点)

- vite@**8.1**:Current minor,常规补丁
- vite@**8.0** / vite@**7.3**:重要修复 + 安全补丁
- vite@**6.4**:仅安全补丁
- 更早版本:**已停止支持**

---

## 十四、下一步

1. ✅ 本规划文档(v2,本文件)
2. → Claude Code CLI 提示词 v2(`CLAUDE_CODE_PROMPT.md`)
3. → 在本地跑 Claude Code 起项目,先把 M1 阶段交付
4. → 收集 5 个种子读者反馈再写 M2 内容

---

**文档版本**:v2.0
**作者**:Cyrus Doyle
**最后更新**:2026-06-25
**主要变更**:基于 Vite 8 实际发布情况(2026-03)重写;新增 Part 2 Bundler Evolution、Part 5 Environment API;新增 `<V7Note>` 折叠组件机制;新增 Appendix 迁移指南;实战项目从 8 个增加到 10 个
