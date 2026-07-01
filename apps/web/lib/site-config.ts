/**
 * 站点级常量 —— 只保留不会被翻译的"事实数据"。
 *
 * 所有面向用户的中/英文文案(title / description / summary / blurb / outcome 等)
 * 已迁移到 `apps/web/messages/{zh,en}.json`,通过 next-intl 的 t() 在组件层取用。
 *
 * 这里保留:品牌名/URL/作者署名/章节结构数据/实战项目结构数据。
 */

export const SITE = {
  name: "vite-mastery",
  playgroundUrl: (() => {
    const raw = process.env.NEXT_PUBLIC_PLAYGROUND_URL ?? "http://localhost:5173"
    return /^https?:\/\//.test(raw) ? raw : `https://${raw}`
  })(),
  author: {
    name: "Cyrus Doyle",
    handle: "@yonjay",
  },
  url: "https://vite-mastery.dev",
  repo: "https://github.com/Mt-Youya/vite-mastery",
  ogImage: "/opengraph-image",
} as const

/**
 * 14 个 Part 的结构性元数据 —— 不含 title / summary,它们在 messages.parts.<id> 取。
 * sidebar / 首页章节预览共用。
 */
export const PARTS = [
  { id: "00-getting-started", no: "00", chapters: 5, difficulty: 1 },
  { id: "01-core-concepts", no: "01", chapters: 6, difficulty: 2 },
  { id: "02-bundler-evolution", no: "02", chapters: 5, difficulty: 3, spotlight: true },
  { id: "03-plugin-system", no: "03", chapters: 6, difficulty: 2, spotlight: true },
  { id: "04-hooks-deep-dive", no: "04", chapters: 9, difficulty: 3, spotlight: true },
  { id: "05-environment-api", no: "05", chapters: 10, difficulty: 4, spotlight: true },
  { id: "06-hmr", no: "06", chapters: 6, difficulty: 3, spotlight: true },
  { id: "07-build-pipeline", no: "07", chapters: 9, difficulty: 2 },
  { id: "08-ssr-ssg", no: "08", chapters: 4, difficulty: 3 },
  { id: "09-framework-integration", no: "09", chapters: 6, difficulty: 2 },
  { id: "10-library-mode", no: "10", chapters: 3, difficulty: 2 },
  { id: "11-monorepo", no: "11", chapters: 4, difficulty: 2 },
  { id: "12-performance", no: "12", chapters: 7, difficulty: 3 },
  { id: "13-real-world-plugins", no: "13", chapters: 4, difficulty: 4 },
] as const

/**
 * 10 个实战项目结构数据 —— title / blurb / outcome 走 messages.examplesData.<id>。
 * 顺序按 PLAN.md §五,不按章节号排。
 */
export const EXAMPLES = [
  { id: "plugin-virtual-modules", chapter: "3.4", difficulty: 1 },
  { id: "plugin-md-loader", chapter: "4.8", difficulty: 2 },
  { id: "plugin-i18n", chapter: "4.9", difficulty: 2 },
  { id: "plugin-image-optimizer", chapter: "7.7", difficulty: 3 },
  { id: "plugin-rollup-rolldown-compat", chapter: "2.5", difficulty: 3 },
  { id: "env-api-rsc-demo", chapter: "5.10", difficulty: 4 },
  { id: "ssr-with-env-api", chapter: "8.2", difficulty: 3 },
  { id: "library-mode-demo", chapter: "10.3", difficulty: 3 },
  { id: "monorepo-template", chapter: "11.3", difficulty: 2 },
  { id: "plugin-auto-import", chapter: "13.4", difficulty: 4 },
] as const

/**
 * 主导航条目 —— label 走 messages.nav.<id>。
 * `localizedHref(href, locale)` 拼成 `/zh/docs` / `/en/docs`,在组件里用。
 */
export const NAV_LINKS = [
  { id: "docs", href: "/docs" },
  { id: "examples", href: "/examples" },
  { id: "playground", href: "/playground" },
  { id: "about", href: "/about" },
] as const

export type PartMeta = (typeof PARTS)[number]
export type ExampleMeta = (typeof EXAMPLES)[number]
