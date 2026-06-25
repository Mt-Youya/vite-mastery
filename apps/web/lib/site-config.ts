/**
 * 站点级常量与文案。集中放在一处,避免散在组件里。
 */

export const SITE = {
  name: "vite-mastery",
  title: "vite-mastery · 搞懂 Vite,从机制到插件",
  description:
    "中文社区第一份系统化的 Vite 核心原理与 Hooks 深度指南。读完能写出生产级插件,理解 dev server / build / HMR 全链路。",
  author: {
    name: "Jay (Yonjay)",
    bio: "前端工程师 · 关心构建工具与开发者体验",
    handle: "@yonjay",
  },
  url: "https://vite-mastery.dev",
  repo: "https://github.com/Mt-Youya/vite-learning",
  ogImage: "/opengraph-image",
} as const;

/** 11 个 Part 的元数据 —— sidebar / 首页章节预览共用 */
export const PARTS = [
  {
    id: "00-getting-started",
    no: "00",
    title: "入门铺垫",
    summary: "Vite 为何而生,五分钟跑通第一个项目。",
    chapters: 4,
    difficulty: 1,
  },
  {
    id: "01-core-concepts",
    no: "01",
    title: "核心概念",
    summary: "Native ESM、双引擎架构、依赖预构建、Module Graph。",
    chapters: 4,
    difficulty: 2,
  },
  {
    id: "02-plugin-system",
    no: "02",
    title: "插件系统",
    summary: "插件结构、enforce 顺序、调试技巧、第一个虚拟模块插件。",
    chapters: 6,
    difficulty: 2,
    spotlight: true,
  },
  {
    id: "03-hooks-deep-dive",
    no: "03",
    title: "Hooks 深度解析",
    summary: "构建期 hooks、Vite 独有 hooks、Environment API、两个实战插件。",
    chapters: 9,
    difficulty: 3,
    spotlight: true,
  },
  {
    id: "04-hmr",
    no: "04",
    title: "HMR 热更新",
    summary: "WebSocket 协议、import.meta.hot、框架的 Fast Refresh 内幕。",
    chapters: 5,
    difficulty: 3,
    spotlight: true,
  },
  {
    id: "05-build-pipeline",
    no: "05",
    title: "生产构建",
    summary: "Rollup 在 Vite 里的角色、资源管线、代码分割、图片优化实战。",
    chapters: 5,
    difficulty: 2,
  },
  {
    id: "06-ssr-ssg",
    no: "06",
    title: "SSR & SSG",
    summary: "ssrLoadModule、手写 SSR、静态生成模式。",
    chapters: 3,
    difficulty: 3,
  },
  {
    id: "07-framework-integration",
    no: "07",
    title: "框架集成",
    summary: "React / Vue / Svelte / Solid + meta 框架对比。",
    chapters: 5,
    difficulty: 2,
  },
  {
    id: "08-library-mode",
    no: "08",
    title: "库模式",
    summary: "build.lib 全解、类型声明、跨框架组件库实战。",
    chapters: 3,
    difficulty: 2,
  },
  {
    id: "09-monorepo",
    no: "09",
    title: "Monorepo 工程化",
    summary: "pnpm workspace、依赖预构建跨包问题、Turborepo 编排。",
    chapters: 4,
    difficulty: 2,
  },
  {
    id: "10-performance",
    no: "10",
    title: "性能优化",
    summary: "冷启动、HMR 诊断、bundle 分析、tree-shaking 实战。",
    chapters: 4,
    difficulty: 3,
  },
  {
    id: "11-real-world-plugins",
    no: "11",
    title: "真实世界插件赏析",
    summary: "auto-import / plugin-pages / plugin-react 源码导读 + auto-import 复刻。",
    chapters: 4,
    difficulty: 4,
  },
] as const;

/** 8 个实战项目元数据 */
export const EXAMPLES = [
  {
    id: "plugin-virtual-modules",
    title: "虚拟模块插件",
    chapter: "2.4",
    difficulty: 1,
    blurb: "用 resolveId + load 凭空生成一个模块",
    outcome: "一个可发布的 npm 插件雏形",
  },
  {
    id: "plugin-md-loader",
    title: "Markdown 加载器",
    chapter: "3.8",
    difficulty: 2,
    blurb: "把 .md 文件变成可热更的 React 组件",
    outcome: "完整的 loader,可发到 npm",
  },
  {
    id: "plugin-i18n",
    title: "i18n 自动注入",
    chapter: "3.9",
    difficulty: 2,
    blurb: "transformIndexHtml + resolveId 组合",
    outcome: "实用工具插件,真实生产可用",
  },
  {
    id: "plugin-image-optimizer",
    title: "图片优化插件",
    chapter: "5.5",
    difficulty: 3,
    blurb: "集成 sharp,自动生成 webp / avif",
    outcome: "生产级插件,带缓存与并行",
  },
  {
    id: "ssr-from-scratch",
    title: "手写 SSR",
    chapter: "6.2",
    difficulty: 3,
    blurb: "纯 Vite + Express,不用任何框架",
    outcome: "理解 SSR 的所有运行机制",
  },
  {
    id: "library-mode-demo",
    title: "跨框架组件库",
    chapter: "8.3",
    difficulty: 3,
    blurb: "一次构建,产出 React/Vue/Svelte/Solid 适配",
    outcome: "可发布的组件库脚手架",
  },
  {
    id: "monorepo-template",
    title: "Monorepo 模板",
    chapter: "9.3",
    difficulty: 2,
    blurb: "复刻本站结构:apps + packages + content",
    outcome: "下一个项目的起点",
  },
  {
    id: "plugin-auto-import",
    title: "简化版 auto-import",
    chapter: "11.4",
    difficulty: 4,
    blurb: "对标 unplugin-auto-import 的核心机制",
    outcome: "综合性插件,Hooks 大乱炖",
  },
] as const;

export const NAV_LINKS = [
  { href: "/docs", label: "文档" },
  { href: "/examples", label: "实战项目" },
  { href: "/about", label: "关于" },
] as const;
