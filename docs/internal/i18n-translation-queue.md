# 英文翻译队列

> 本文件用于追踪 i18n 改造后剩余的英文翻译工作。
> 工程基础设施(路由、组件抽串、site-config、scripts、sitemap)已经全部完成,
> 站点在 `/en/*` 下访问时,未翻译的内容会自动 fallback 到中文并显示提醒 banner。

**当前覆盖率**:79 篇 MDX 中,已翻译 79 篇(100%)。✅

## 已完成(79/79 MDX + 10/10 README)

所有文章已于 2026-06-28 通过并行 Workflow(22 agents)翻译完成。

**content/00-getting-started/** — 4 篇 ✅
**content/01-core-concepts/** — 4 篇 ✅
**content/02-bundler-evolution/** — 5 篇 ✅
**content/03-plugin-system/** — 6 篇 ✅
**content/04-hooks-deep-dive/** — 9 篇 ✅
**content/05-environment-api/** — 10 篇 ✅
**content/06-hmr/** — 6 篇 ✅
**content/07-build-pipeline/** — 7 篇 ✅
**content/08-ssr-ssg/** — 4 篇 ✅
**content/09-framework-integration/** — 6 篇 ✅
**content/10-library-mode/** — 3 篇 ✅
**content/11-monorepo/** — 4 篇 ✅
**content/12-performance/** — 6 篇 ✅
**content/13-real-world-plugins/** — 4 篇 ✅
**content/appendix/** — 1 篇 ✅

**examples/\*/README.en.md** — 10 个 ✅

## 已知剩余 warn (13 项,不阻断 CI)

这些 warn 都是原有 ZH 文件里 "在 Vite 7 中..." 的写法未改为 `<V7Note>` — 已存在于改造前,属于内容质量债务,不影响站点运行。

## 翻译规范归档

- frontmatter `title` / `description` 翻译为英文,其余字段保持原样
- 代码块、命令、文件路径原样保留
- Vite/Rolldown/HMR/ESM 等技术术语保留英文
- `<V7Note>` / `<Callout>` 等 MDX 组件标签保留,内部文本翻译
- Part 05 EN 文件顶部有英文 RC 警告 Callout
- check-content 脚本已适配同时识别 "RC 阶段"(ZH)和 "RC stage"(EN)

## 可选后续优化

- [ ] 专门审校 Part 02(Bundler Evolution)和 Part 05(Environment API)这两个技术深度最高的章节
- [ ] 让 i18n 专业校对过一遍 Part 03/04(Plugin System / Hooks)的技术表述
- [ ] Showcase 子页 demo 文案(v7-note / bundler-compare 等)目前是硬编码中文,EN 访问时显示中文 — 可后续补
- [ ] OG 图视觉文字目前是硬编码中文 — 可后续加路由级覆盖
