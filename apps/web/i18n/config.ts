/**
 * i18n 配置中心 —— 所有 locale 常量集中在这里,避免散落硬编码。
 */

export const LOCALES = ["en", "zh"] as const
export type Locale = (typeof LOCALES)[number]

/** 无显式语言偏好时使用的默认路由语言。 */
export const DEFAULT_LOCALE: Locale = "en"

/** 内容缺失翻译时的兜底语言。源码内容最早以中文写成,这里不要跟随默认路由语言变动。 */
export const CONTENT_FALLBACK_LOCALE: Locale = "zh"

/** 用于 <html lang> 的完整 BCP47 标签。MDX 内容里的 zh 默认是简体。 */
export const LOCALE_HTML_TAG: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
}

export const LOCALE_LABEL: Record<Locale, { native: string; en: string }> = {
  zh: { native: "中文", en: "Chinese" },
  en: { native: "English", en: "English" },
}

/** Open Graph locale 标签。 */
export const OG_LOCALE: Record<Locale, string> = {
  zh: "zh_CN",
  en: "en_US",
}

/** 持久化用户语言偏好的 cookie 名。 */
export const LOCALE_COOKIE = "vite-mastery-locale"

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
}
