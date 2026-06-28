"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/i18n/config"
import { stripLocaleFromPath } from "@/lib/i18n-routing"
import { cn } from "@/lib/utils"

/**
 * 顶部语言切换 —— 显示 `中文 / English` 两个并排按钮。
 * 触发时:
 *   1. 写 cookie 记忆用户选择(覆盖 Accept-Language 协商)
 *   2. router.replace 到对端 locale 的同一路径,使用 transition 避免页面闪烁
 */
export function LangSwitcher() {
  const t = useTranslations("lang")
  const router = useRouter()
  const pathname = usePathname() ?? "/"
  const current = useLocale() as Locale
  const [, startTransition] = useTransition()

  function switchTo(next: Locale) {
    if (next === current) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    const bare = stripLocaleFromPath(pathname, LOCALES)
    const target = bare === "/" ? `/${next}` : `/${next}${bare}`
    startTransition(() => {
      router.replace(target)
      router.refresh()
    })
  }

  return (
    <div
      role="group"
      aria-label={t("switcher")}
      className="inline-flex items-center rounded-md border border-border bg-bg-elevated p-0.5 font-mono text-2xs"
    >
      {LOCALES.map((locale) => {
        const active = locale === current
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={active}
            aria-label={t("current", { lang: t(locale) })}
            className={cn(
              "rounded px-2 py-1 tracking-wider transition-colors duration-base",
              active ? "bg-bg text-fg shadow-xs" : "text-fg-subtle hover:text-fg"
            )}
          >
            {t(locale)}
          </button>
        )
      })}
    </div>
  )
}
