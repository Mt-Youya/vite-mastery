# Codex CLI 提示词 v2 · vite-mastery 站点

> 配套文档:`PLAN.md` v2
> 使用方式:保存为 `AGENTS.md` 放在仓库根目录,Codex 启动时自动读取。
> 然后逐阶段把 §阶段 X 内容粘进 Codex 作为 prompt。
> **版本**:v2 (2026-06-25,匹配 Vite 8 主轴 + Vite 7 折叠注释机制)

---

## 0 · 项目宪法(任何阶段都不许违背)

### 0.1 沟通语言

- 所有对话回复用**中文**
- 所有代码注释用**中文**
- 所有 README / 文档 MDX 用**中文**(英文术语保留:HMR / ESM / Rolldown / OXC 等不翻译)
- commit message 用简短英文, commit type 保留英文(feat / fix / docs / refactor / chore)

### 0.2 技术栈(锁定,不许替换)

| 项                    | 必须                                             | 禁止                                                 |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| **Vite 演示版本基线** | **Vite 8.1.x**                                   | Vite 7 及更早版本作为演示主线                        |
| 框架                  | Next.js **16** (App Router)                      | Pages Router、Next 15 及更早                         |
| 语言                  | TypeScript **6**,strict 全开                     | `.js`/`.jsx` 文件                                    |
| 样式                  | Tailwind CSS **v4**,CSS-first `@theme`           | Tailwind v3、JS 配置文件、styled-components、emotion |
| 包管理                | **pnpm** + workspaces                            | npm、yarn、bun                                       |
| Lint/Format           | **oxc**(`oxlint` + `oxfmt`)                      | **Biome 绝对禁止**、Prettier                         |
| UI 底座               | **shadcn/ui v4** + **Base UI**(`@base-ui/react`) | Radix 直接依赖(必须通过 Base UI)                     |
| 状态                  | **Zustand**                                      | Redux、Jotai、Recoil、Context 滥用                   |
| 内容                  | **MDX** + `@content-collections/core`            | Contentlayer、纯 markdown                            |
| 部署                  | **Vercel**                                       | 其他平台(本期不考虑)                                 |

### 0.3 Vite 版本规约(v2 核心新增)

- **正文示例代码统一基于 Vite 8.1.x**
- **每篇 MDX 必须有 frontmatter:**
  ```yaml
  viteVersion: "8.1"
  apiStability: "stable" | "rc" | "experimental"
  ```
- **Vite 7 差异不写进正文**,统一用 `<V7Note>` 折叠组件:
  ```mdx
  <V7Note title="Vite 7 行为差异">在 Vite 7 中,... 而 Vite 8 改为 ... 迁移路径:...</V7Note>
  ```
- **绝对禁止在正文写"在 Vite 6 中..."这种**——超过 2 个版本之前的差异不再覆盖
- Environment API 相关内容**必须**在文章顶部 callout 标注:
  ```mdx
  <Callout type="warning">
    Environment API 当前处于 RC 阶段,具体 API 名称可能在未来 minor 中变化。本文基于 Vite 8.1.x。
  </Callout>
  ```

### 0.4 代码风格

- 缩进 2 空格,不用 tab
- 字符串优先双引号
- 行宽 100 字符
- 文件名 kebab-case(`hook-explorer.tsx`),组件名 PascalCase
- 导入顺序:Node 内建 → 第三方 → `@/` 别名 → 相对路径 → 类型导入
- React 组件用函数声明 `function Foo()` 而不是箭头函数赋值
- 服务端组件优先,只有需要交互才加 `"use client"`

### 0.5 协作准则

- **不要自作主张装新依赖**——任何新增 npm 包必须先列出,等我确认
- **不要修改 `package.json` scripts 字段** 除非明确要求
- **不要跳步骤**——按阶段执行,每个阶段结束 stop 并报告
- **不许生成假数据糊弄**——所有教程内容、代码示例必须真实可跑
- **遇到不确定的技术决策,先问**——不要瞎猜
- **凡是涉及 Vite 8 / Rolldown / Environment API 的事实性陈述,如果不确定,要么不写、要么停下来问** —— 这块社区资料少,出错代价大

### 0.6 输出规范

- 每完成一个文件,简短说明它的作用(一句话)
- 每完成一个阶段,输出本阶段创建/修改的文件清单
- 遇到错误**不要静默 try-catch**,要向用户报告

---

## 1 · 项目背景

你正在帮我(Jay,一位前端工程师)搭建一个名为 `vite-mastery` 的 Vite 学习指南网站。它的核心定位是:

> **Vite 8 核心机制 + Rolldown 架构 + Environment API + Hooks/插件深度解析**

辅以多框架集成、库模式、SSR、性能优化、Monorepo 工程化等实战。

**双版本策略**:以 Vite 8 为主线,Vite 7 差异点用 `<V7Note>` 折叠组件标注。

完整规划见 `PLAN.md`(同目录)。每开始一个阶段前,先 `@PLAN.md` 引用对应章节,确保理解一致。

---

## 2 · 阶段划分

整个项目分为 **10 个阶段**,每个阶段都是独立 prompt,跑完一个再下一个。

| 阶段 | 名称                                | 预计文件数 | 关键产出                                                                      |
| ---- | ----------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| 1    | Monorepo 骨架                       | ~15        | pnpm workspace + 目录结构                                                     |
| 2    | 共享配置包                          | ~20        | tsconfig / tailwind / oxc / ui 包                                             |
| 3    | Next.js 主站初始化                  | ~25        | App Router + MDX 管线 + 首页                                                  |
| 4    | 文档站骨架                          | ~30        | sidebar / TOC / 代码块 / 搜索                                                 |
| 5    | 交互式 MDX 组件(含 `<V7Note>`)      | ~18        | `<HookExplorer>` `<PluginPipeline>` `<HmrDemo>` `<V7Note>` `<BundlerCompare>` |
| 6    | 内容写作脚手架                      | ~10        | 内容写作辅助脚本 + 模板                                                       |
| 7    | 实战项目目录骨架                    | ~20        | 10 个 examples 的初始化                                                       |
| 8    | 部署配置                            | ~5         | Vercel 配置、preview workflow                                                 |
| 9    | 首批内容填充(Part 0 + Part 3.1~3.4) | ~20        | 入门 + 插件系统前半                                                           |
| 10   | 独家内容首发(Part 2 + Part 5.1~5.3) | ~15        | Bundler Evolution + Env API 开篇                                              |

---

## 3 · 阶段 1 · Monorepo 骨架

### 任务

搭建 pnpm monorepo 基础目录结构,确保 `pnpm install` 跑通。

### 具体动作

1. 仓库根目录创建:
   - `package.json`(根)— workspace 脚本入口
   - `pnpm-workspace.yaml` — 声明 workspaces
   - `.npmrc` — 启用 `shamefully-hoist=false`、`auto-install-peers=true`
   - `.gitignore` — Node/Next/Vercel 标准忽略
   - `.nvmrc` — Node 24
   - `README.md` — 中文项目介绍(简短,说清楚定位是 Vite 8 学习指南)
   - `tsconfig.json` — 根 tsconfig,只做引用聚合
   - `.oxlintrc.json` — 根 lint 配置
   - `.oxfmtrc.json` — 根 format 配置

2. 创建目录(空目录用 `.gitkeep`):

   ```
   apps/web/
   apps/playground/
   packages/ui/
   packages/mdx-components/
   packages/content-config/
   packages/tailwind-config/
   packages/tsconfig/
   packages/eslint-config/
   content/
   content/appendix/
   examples/
   ```

3. 根 `package.json` scripts:
   ```
   dev / build / lint / format / typecheck / clean
   ```
   全部通过 `pnpm -r` 或 `turbo` 派发,**不要在根 package.json 写具体命令**。

### 验收

- `pnpm install` 成功,无 ERROR
- `pnpm -r run build` 不报"找不到 script"
- `tree -L 2 -I node_modules` 输出结构清晰

### 完成后报告

列出新建的所有文件路径,及 `pnpm install` 日志摘要。然后停下,等我说"进入阶段 2"。

---

## 4 · 阶段 2 · 共享配置包

### 任务

搭建 `packages/` 下所有共享配置包,让后续 `apps/` 直接消费。

### 具体动作

**4.1 `packages/tsconfig/`**

- `base.json` — 通用 strict 配置(target ES2022, module Preserve, moduleResolution Bundler)
- `nextjs.json` — extends base,加 Next 相关
- `react-library.json` — extends base,加 jsx preserve
- `package.json` — `"main": "base.json"`,内部包

**4.2 `packages/tailwind-config/`**

- `theme.css` — `@theme` 块,定义站点设计 tokens(色板、字号、字重、行高、间距、圆角、动效曲线)
- `base.css` — `@layer base` 重置和全局样式
- `package.json` — 导出 `./theme.css` `./base.css`
- 调用 **gpt-taste** skill 决定具体 token 数值

**4.3 `packages/eslint-config/`**

- 实际是 oxlint 配置共享包
- `oxlint.json` — react / typescript / nextjs 三套预设导出

**4.4 `packages/ui/`**

- 用 **Base UI**(`@base-ui/react`)作为底层 primitive
- 用 **shadcn/ui v4** 的设计 token
- 必须实现的组件:
  - Button / IconButton
  - Dialog / Sheet
  - Popover / Tooltip
  - Tabs
  - Select / Combobox
  - Toggle / Switch
  - Separator
  - ScrollArea
  - **Collapsible**(给 `<V7Note>` 用)
  - 代码块容器 `<CodeBlock>`
- 每个组件单独文件,统一从 `src/index.ts` re-export
- 用 **Vite 8 库模式**打包(理由:本站宣传 Vite,自己得用最新版)
- 调用 **baseline-ui** skill 设计组件 API 与默认样式
- 调用 **ui-ux-pro-max** skill 精修交互细节

**4.5 `packages/content-config/`**

- 用 `@content-collections/core` + `@content-collections/mdx`
- 声明 collections:
  - `docs`(主教程,字段:title / description / order / chapter / part / authors / updatedAt / **viteVersion** / **apiStability**)
  - `examples`(实战项目元数据)
  - `appendix`(附录,如迁移指南)
- 导出 `defineConfig` 给 `apps/web` 消费

**4.6 `packages/mdx-components/`**

- 通用 MDX 组件:`<Callout>` `<CodeGroup>` `<Steps>` `<Tabs>` `<Diff>` `<Detail>`
- 代码高亮用 **Shiki**,主题 light/dark 自动切换
- 支持 Shiki **twoslash**,鼠标 hover 展示 TS 类型
- 这一步只搭骨架,`<V7Note>` 等专属组件放阶段 5

### 验收

- `pnpm -r run build` 全部成功
- `pnpm -r run typecheck` 零 error
- 在 `apps/web` 里 `import { Button } from "@vite-mastery/ui"` 能拿到 IntelliSense

### 完成后报告

列出每个 package 的 `exports` 字段和导出的 API 清单。然后停下,等我说"进入阶段 3"。

---

## 5 · 阶段 3 · Next.js 主站初始化

### 任务

搭建 `apps/web/` Next.js 16 App Router 项目,接入所有共享包,跑通首页。

### 具体动作

1. `apps/web/package.json` — 依赖 `@vite-mastery/*` workspace 包
2. `apps/web/next.config.ts` — 启用 `transpilePackages` 包含所有 workspace 包
3. `apps/web/tsconfig.json` — extends `@vite-mastery/tsconfig/nextjs.json`
4. `apps/web/app/layout.tsx` — 全局布局,引入 Tailwind v4 theme
5. `apps/web/app/page.tsx` — 首页(营销页)
   - **调用 impeccable + taste-skill**
   - 区块:Hero(突出 Vite 8 + Rolldown)/ Why Vite 8 / 章节预览(14 个 Part 卡片)/ 实战项目预览 / 作者介绍 / CTA / Footer
   - 用 `@vite-mastery/ui` 的 Button 等组件
6. `apps/web/app/globals.css` — `@import "tailwindcss"` + `@import "@vite-mastery/tailwind-config/theme.css"`
7. `apps/web/app/docs/layout.tsx` — 文档站布局占位(下一阶段细化)
8. `apps/web/app/docs/page.tsx` — 文档首页占位
9. `apps/web/components/site-header.tsx` — 顶部导航(含 Vite 8 / Vite 7 版本切换 hint)
10. `apps/web/components/site-footer.tsx` — 底部
11. `apps/web/components/theme-toggle.tsx` — 暗色模式切换(用 `next-themes`)
12. `apps/web/lib/utils.ts` — `cn()` 工具函数

### 首页 Hero 文案要点(写作时遵循)

- 标题强调 "Vite 8 时代的中文学习指南"
- 副标题点出三个独家:Rolldown 架构、Environment API、Hooks 深度
- 不要写"全网最详细""唯一中文"这种没营养的话

### 验收

- `pnpm --filter web dev` 启动成功,本地访问 3000 端口
- 首页在 desktop / mobile 两种视口都不破样
- 无控制台 error / warning
- Lighthouse 首屏 performance ≥ 90

### 完成后报告

文字描述首页各区块的视觉效果。然后停下,等我说"进入阶段 4"。

---

## 6 · 阶段 4 · 文档站骨架

### 任务

搭建 `/docs/*` 路由下的文档站完整骨架。重点在**信息架构和导航**,不写具体教程内容。

### 具体动作

1. `apps/web/app/docs/[...slug]/page.tsx` — 动态路由,接 content-collections
2. `apps/web/app/docs/layout.tsx` — 三栏布局:
   - 左:章节 sidebar(14 个 Part 可折叠)
   - 中:MDX 正文(顶部显示 `viteVersion` 徽章 + `apiStability` 徽章)
   - 右:页内 TOC(自动从 h2/h3 提取)
3. `apps/web/components/docs/sidebar.tsx`
   - **调用 baseline-ui**
   - 树状结构,当前路由高亮,折叠状态持久化(zustand + localStorage)
   - 章节按 PLAN.md §四 的 14 个 Part 排序
4. `apps/web/components/docs/toc.tsx`
   - 滚动同步高亮当前章节
   - **调用 ui-ux-pro-max** 精修滚动动效
5. `apps/web/components/docs/breadcrumb.tsx` — 面包屑
6. `apps/web/components/docs/pager.tsx` — 上一篇/下一篇导航
7. `apps/web/components/docs/search.tsx` — 搜索框
   - 用 **Pagefind**(静态搜索),build 后生成索引
   - `cmd+k` 唤起,弹窗用 Base UI Dialog
8. `apps/web/components/docs/version-badge.tsx` — Vite 版本徽章(`viteVersion: 8.1` 渲染成视觉徽章)
9. `apps/web/components/docs/stability-badge.tsx` — API 稳定性徽章(stable/rc/experimental 三色)
10. `apps/web/lib/docs-tree.ts` — content-collections flat 数据转成 sidebar 树
11. 创建 3 篇假内容(`content/00-getting-started/01-why-vite.mdx` 等)验证渲染
12. 代码块支持复制按钮、文件名标签、行高亮、diff 模式

### 验收

- 任意一篇假内容能渲染,版本徽章正确显示
- sidebar 折叠/展开流畅,刷新后保持状态
- TOC 滚动同步准确
- `cmd+k` 搜索可用
- 暗色模式下代码块、Callout、表格、徽章都正常

### 完成后报告

列出文档页 URL 结构、所有交互快捷键、sidebar 数据流。然后停下,等我说"进入阶段 5"。

---

## 7 · 阶段 5 · 交互式 MDX 组件(v2 加强)

### 任务

实现教程里要用的核心交互式组件。这一步是全站差异化的关键。

**全程调用 ui-ux-pro-max skill。**

### 7.1 必须实现的组件

#### `<V7Note />` ⭐ v2 核心新增

- **用途**:折叠展示 Vite 7 与 Vite 8 行为差异
- **API**:
  ```mdx
  <V7Note title="Vite 7 行为差异">正文 markdown</V7Note>
  ```
- **视觉**:
  - 折叠态:一行 hint,左侧 Vite 7 logo 灰度图标,右侧展开箭头
  - 展开态:橙色边框、Vite 7 标识、内容区
  - 暗色模式适配
- **可达性**:Tab 可达,Enter/Space 展开
- **底层**:Base UI Collapsible

#### `<BundlerCompare />` ⭐ v2 核心新增

- **用途**:对比 Vite 7(esbuild+Rollup)与 Vite 8(Rolldown)的架构图
- **形态**:左右双栏架构图,可点击 hover 高亮组件流
- **数据**:写死在组件内,不接外部数据
- **用在哪**:Part 2 Bundler Evolution

#### `<HookExplorer />`

- **用途**:Vite/Rolldown hooks 时序图查看器
- **输入**:hook 列表
- **输出**:可点击的时序条,点击展示该 hook 的:触发时机、参数签名、典型场景、示例代码
- **新增**:右上角显示该 hook 在 Rollup / Rolldown 下是否一致
- **状态**:zustand

#### `<PluginPipeline />`

- **用途**:插件执行顺序可视化
- **输入**:一组插件配置(name + enforce + 哪些 hook)
- **输出**:按 `pre` / 默认 / `post` 分组的执行流程图
- **hover**:某个插件,高亮它影响的 hook

#### `<HmrDemo />`

- **用途**:HMR 协议演示器
- **左侧**:编辑器(CodeMirror 6 或 Monaco lite)
- **右侧**:WebSocket 消息流(模拟,不真连服务器)
- **特性**:修改代码,展示 client ↔ server 通信报文

#### `<EnvironmentExplorer />` ⭐ v2 核心新增

- **用途**:可视化展示 client / ssr / 自定义环境的隔离边界
- **形态**:多个环境框,每个框有自己的 module graph
- **交互**:点击某个模块,展示它在哪些环境出现、`importer` 是谁
- **用在哪**:Part 5 Environment API

#### `<ConfigPlayground />`

- **用途**:Vite 配置交互式编辑器
- **特性**:用户改 `vite.config.ts` 字段,实时展示影响的产物结构

#### `<DepGraph />`

- **用途**:Module Graph 可视化
- **库**:`@xyflow/react`
- **特性**:展示 Vite 的依赖图,可点击查看每个节点的 import/importer

### 7.2 通用规范

- 全部用 Base UI primitive(Tabs / Popover / Tooltip / Dialog / Collapsible)
- 全部支持键盘操作(Tab 遍历、Space 触发)
- 全部有 loading / empty / error 三态
- 全部响应暗色模式

### 验收

- 每个组件单独的 demo 页面(`/showcase/<component-name>`)
- 键盘可达性通过 axe 检测
- 移动端可用(可不优雅但不能不能用)
- **`<V7Note>` 折叠动画流畅,不抖**(单独说明,这是高频组件)

### 完成后报告

为每个组件输出一段 markdown,说明 props 表 + 使用示例 + 典型场景。然后停下,等我说"进入阶段 6"。

---

## 8 · 阶段 6 · 内容写作脚手架

### 任务

让写新教程像填表一样简单。

### 具体动作

1. `scripts/new-doc.ts` — 交互式 CLI
   - 询问:章节(0~13 或 appendix)/ 标题 / 难度 / 预计阅读时间 / `viteVersion`(默认 8.1)/ `apiStability`(默认 stable)
   - 生成 frontmatter 完备的 MDX 模板
   - 模板包含「你将学到什么」「前置知识」「自测题」三个固定 section
   - 如果选择章节是 Part 5 (env-api),自动插入 RC 警告 Callout

2. `scripts/new-example.ts` — 实战项目脚手架
   - 询问:项目名 / 关联章节
   - 在 `examples/<name>/` 生成完整结构(README + steps/ + final/)
   - 默认 `vite.config.ts` 用 Vite 8 写法

3. `scripts/check-content.ts` — 内容质量检查
   - 校验所有 MDX 是否有完整 frontmatter(含 `viteVersion`)
   - 校验所有 code block 有语言标记
   - 校验所有外链可达(可选,慢)
   - **新增**:校验 Vite 7 差异是否用 `<V7Note>` 而不是写在正文

4. `scripts/new-v7note.ts` — `<V7Note>` 快速生成片段
   - 输入 Vite 8 行为 + Vite 7 行为 → 输出标准 V7Note MDX 片段

5. `.github/PULL_REQUEST_TEMPLATE.md` — 中文 PR 模板

6. `apps/web/app/sitemap.ts` — 自动生成 sitemap

### 验收

- `pnpm new:doc` 跑通,生成的文件可直接 commit
- `pnpm new:example` 跑通
- `pnpm check:content` 在没问题时静默,有问题时清晰报错

### 完成后报告

列出每个脚本的命令名和用法示例。然后停下,等我说"进入阶段 7"。

---

## 9 · 阶段 7 · 实战项目目录骨架

### 任务

初始化 **10 个** examples 项目,每个项目能独立 `pnpm dev`。

### 具体动作

按 `PLAN.md §五` 创建 10 个项目:

| #     | 目录                                             |
| ----- | ------------------------------------------------ |
| 1     | `examples/plugin-virtual-modules/`               |
| 2     | `examples/plugin-md-loader/`                     |
| 3     | `examples/plugin-i18n/`                          |
| 4     | `examples/plugin-image-optimizer/`               |
| **5** | **`examples/plugin-rollup-rolldown-compat/`** 🆕 |
| **6** | **`examples/env-api-rsc-demo/`** 🆕              |
| 7     | `examples/ssr-with-env-api/`                     |
| 8     | `examples/library-mode-demo/`                    |
| 9     | `examples/monorepo-template/`                    |
| 10    | `examples/plugin-auto-import/`                   |

每个项目必须有:

- `README.md` — 项目目标 / 学习要点 / 步骤拆解(中文)
- `package.json` — 独立依赖,**Vite 8.1.x 基线**,**不依赖 workspace 包**(实战项目要能直接 clone 出去跑)
- `vite.config.ts` — 最小可跑配置
- `src/` — 起始代码
- `steps/` — 空目录(后续 step-01 ~ step-N)
- `final/` — 空目录

**项目 5 (plugin-rollup-rolldown-compat) 的特殊要求**:

- 需要包含一份 `compatibility-matrix.md`,记录 Rollup 与 Rolldown 之间的 hook 行为差异

**项目 6 (env-api-rsc-demo) 的特殊要求**:

- README 顶部必须放醒目的"Env API 处于 RC 阶段"警告
- 锁定 Vite 版本到 `8.1.x` 而不是 `^8.1`

**项目 8 (library-mode-demo) 是 monorepo**,内部分 `core/react/vue/svelte/solid` 5 个子包。

### 验收

- `pnpm --filter ./examples/plugin-virtual-modules dev` 能起来
- 其他 9 个同理
- 每个 README 长度 ≥ 200 字,讲清楚学什么

### 完成后报告

列出 10 个项目的"学完能做什么"。然后停下,等我说"进入阶段 8"。

---

## 10 · 阶段 8 · 部署配置

### 任务

让项目能 push 到 GitHub 后自动部署到 Vercel。

### 具体动作

1. `vercel.json`(根)— 指定 buildCommand 与 outputDirectory
2. `apps/web/vercel.json`(如需要)— 主站独立配置
3. `.github/workflows/ci.yml` — PR 时跑 typecheck / lint / build
4. `.github/workflows/preview.yml` — Vercel preview 触发
5. `apps/web/app/robots.ts` — robots
6. `apps/web/app/opengraph-image.tsx` — 默认 OG 图(用 `next/og`)

### 验收

- 推到 GitHub 后 Vercel 自动构建成功
- CI 全绿
- 访问 preview URL 一切正常

### 完成后报告

给出生产 URL 和首次构建耗时。然后停下,等我说"进入阶段 9"。

---

## 11 · 阶段 9 · 首批内容填充(Part 0 + Part 3 前半)

### 任务

填充 Part 0 全章 + Part 3.1~3.4(插件系统第一部分),让站点上线时不空。

### 具体动作

**Part 0 · Getting Started**

- `content/00-getting-started/01-why-vite.mdx`(强调 Vite 8 时代的承诺)
- `content/00-getting-started/02-first-project.mdx`(`pnpm create vite@latest`)
- `content/00-getting-started/03-project-anatomy.mdx`
- `content/00-getting-started/04-how-to-read.mdx`(说明 `<V7Note>` 约定)

**Part 3 · Plugin System(前半)**

- `content/03-plugin-system/01-vite-rolldown-rollup-plugin.mdx`(三者关系)
- `content/03-plugin-system/02-anatomy.mdx`
- `content/03-plugin-system/03-execution-order.mdx`
- `content/03-plugin-system/04-virtual-modules-plugin.mdx`(配合实战项目 1)

### 写作规范(逐条遵守)

- 字数:每节 1500~3000 中文字
- frontmatter 必须含 `viteVersion: "8.1"` 和 `apiStability: "stable"`
- 每节开头必有「**你将学到什么**」+「**前置知识**」两个 Callout
- 每节末尾必有「**自测题**」3~5 道概念题 + 1 道编码题
- 代码示例:每个完整可跑,标注文件名,基于 Vite 8
- 用 `<Diff>` 展示重构步骤
- 用 `<HookExplorer>` `<PluginPipeline>` 之类交互组件,该用就用
- **凡涉及 Vite 7 不同的地方,用 `<V7Note>`,不写进正文**
- 中英术语:首次出现给英文,后续中文
- 不要 "本文将讨论..." 之类废话开场

### 验收

- 8 篇 MDX 全部通过 `pnpm check:content`
- 在站点上逐篇渲染正常
- 中英术语首次出现都有对照
- 至少 4 篇用上了交互式组件
- **至少 3 篇使用了 `<V7Note>`(在合适的位置)**

### 完成后报告

列出每篇文档的字数、用到的交互组件、自测题数量、`<V7Note>` 数量。然后停下,等我说"进入阶段 10"。

---

## 12 · 阶段 10 · 独家内容首发(Part 2 + Part 5 开篇)🆕

### 任务

填充本站两大独家章节的开篇:

- **Part 2 Bundler Evolution** 全章(5 节)
- **Part 5 Environment API** 前 3 节

这是全站差异化的关键,要花最多功夫。

### 具体动作

**Part 2 · Bundler Evolution**

- `content/02-bundler-evolution/01-dual-engine-legacy.mdx`(esbuild + Rollup 双引擎遗产,**大量使用 `<V7Note>` 讲旧设计**)
- `content/02-bundler-evolution/02-what-is-rolldown.mdx`(Rolldown 介绍)
- `content/02-bundler-evolution/03-rolldown-architecture.mdx`(架构剖析,**配 `<BundlerCompare>` 组件**)
- `content/02-bundler-evolution/04-plugin-api-compat.mdx`(插件 API 兼容层)
- `content/02-bundler-evolution/05-cross-bundler-plugin.mdx`(实战项目 5 配套教程)

**Part 5 · Environment API(前 3 节)**

- `content/05-environment-api/01-why-env-api.mdx`(为什么需要 Env API,**顶部 RC 警告**)
- `content/05-environment-api/02-core-concepts.mdx`(Environment、ModuleRunner、HotChannel 三件套,**配 `<EnvironmentExplorer>` 组件**)
- `content/05-environment-api/03-default-environments.mdx`(client vs ssr)

### 写作规范(在阶段 9 基础上增加)

- **Part 5 所有文章 frontmatter 必须**:
  ```yaml
  viteVersion: "8.1"
  apiStability: "rc"
  ```
- **Part 5 所有文章顶部必须有 RC 警告 Callout**
- Part 2 的事实陈述凡涉及 Rolldown 性能数字、Linear/Ramp/Beehiiv 案例等,**必须有引用链接**指向 Vite 8 官方 blog
- **Part 2 第 1 节的 `<V7Note>` 角色反转**:这一节正文讲 Vite 8,`<V7Note>` 反而讲 Vite 7 的"正常"用法——因为这一节就是讲历史
- 实战项目 5 的代码必须能在 **Vite 7(用 `rolldown-vite` 包)和 Vite 8** 两边跑通——否则它失去意义

### 验收

- 8 篇 MDX 全部通过 `pnpm check:content`
- Part 2 所有文章配 `<BundlerCompare>` 至少一次
- Part 5 所有文章配 `<EnvironmentExplorer>` 至少一次
- Part 5 所有文章顶部有 RC 警告
- 实战项目 5 的代码同时在 Vite 7 + rolldown-vite 和 Vite 8 上跑通

### 完成后报告

列出每篇文档的字数、引用的官方链接数、用到的交互组件。然后停下,等我后续指示。

---

## 13 · 通用故障处理预案

### 13.1 装包失败

- 报告:网络错误?registry 问题?peer dep 冲突?
- 我会用 Clash Verge 代理,如果怀疑是网络,提示我手动设置 `pnpm config set registry`

### 13.2 Tailwind v4 配置冲突

- v4 是 CSS-first,不要尝试用 `tailwind.config.ts`
- 所有 token 在 `@theme {}` 块里定义
- 如果某 plugin 不支持 v4,先报告再决定

### 13.3 Base UI API 不熟

- 直接读 `@base-ui/react` 官方文档/源码
- 不要拍脑袋写 API,不确定就停下来问

### 13.4 oxc 限制

- oxlint 不支持某些 ESLint 规则是已知情况,不要装 ESLint 兜底
- 如果遇到 oxlint 完全无法约束的场景,记录在 `docs/internal/known-limitations.md`,后续决定

### 13.5 typecheck 失败

- 不要用 `// @ts-ignore` 或 `any` 糊弄
- 真不会就停下来问我

### 13.6 ⭐ Vite 8 / Rolldown / Env API 事实不确定

- **这是 v2 最重要的故障预案**
- 这块社区资料少,Codex 训练数据可能不全
- 凡是涉及具体 API 名称、参数签名、行为细节,不确定就**停下来问我**,绝对不要瞎编
- 我会查官方文档给你确认答案
- 错一个 API 名称比晚一天交付严重得多

### 13.7 `@vitejs/plugin-react` 版本选择

- 默认使用 **v6**(Oxc Refresh),除非用户明确要求 v5
- v6 不再依赖 Babel,React Compiler 需要单独配置(`reactCompilerPreset` + `@rolldown/plugin-babel`)
- 如果用户提到"想用 React Compiler",主动提醒这个配置变化

---

## 14 · 每个阶段结束的标准报告格式

```markdown
## 阶段 X 完成报告

### 创建的文件

- path/to/file1.ts — 一句话说明
- path/to/file2.tsx — 一句话说明
  ...

### 修改的文件

- path/to/file.ts — 修改内容摘要

### 新增的依赖

- 包名@版本 — 用途
- **(Vite 相关依赖必须列出锁定版本)**

### 已知问题/待办

- 问题1
- 问题2

### Vite 版本相关提示(本阶段)

- 本阶段涉及的 Vite 特性:...
- 是否触及 Env API/Rolldown 等 RC/实验功能:是/否
- 是否需要 `<V7Note>` 标注的差异点:列出来

### 验收结果

- [x] 验收点 1 通过
- [x] 验收点 2 通过
- [ ] 验收点 3 未通过,原因:...

请确认后说"进入阶段 X+1"。
```

---

## 15 · Codex 启动检查清单

每次开新会话,先执行以下检查:

1. `@PLAN.md` 是否存在?读一遍确认上下文
2. `git status` 是否干净?有未提交改动先汇报
3. 当前应该处于哪个阶段?(我会告诉你,或你从 commit 历史推断)
4. Node 版本是否 ≥ 22?pnpm 是否已装?
5. **当前最新 Vite 版本是不是 8.1.x?** 如果有更新,告诉我

确认无误后,问我:"准备好开始阶段 X 了吗?"

---

**文档版本**:v2.0
**最后更新**:2026-06-25
**配套**:`PLAN.md` v2
**主要变更**:基于 Vite 8 主轴重写;新增 `<V7Note>` 折叠组件规约;新增阶段 10 独家内容首发;增加 §0.3 Vite 版本规约和 §13.6 事实不确定处理
