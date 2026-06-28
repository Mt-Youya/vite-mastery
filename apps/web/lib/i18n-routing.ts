/**
 * 与 next-intl 配套的小工具,集中处理 locale 前缀拼接。
 *
 * 站点几乎所有 <Link href="/docs"> 都需要变成 `/en/docs` / `/zh/docs`。
 * 不引入 next-intl 的 navigation API,因为它和 Next 16 的 `next/link` 类型签名细节
 * 多次踩坑;在这里只做最薄的 helper,避免增加抽象。
 */
import type { Locale } from "@/i18n/config"

export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href
  if (href === "/") return `/${locale}`
  return `/${locale}${href}`
}

/** 给当前 pathname 去掉 locale 前缀,得到"裸"路径 —— `/zh/docs/foo` → `/docs/foo`。 */
export function stripLocaleFromPath(pathname: string, locales: readonly Locale[]): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/"
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
  }
  return pathname
}
