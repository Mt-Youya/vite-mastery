"use client"

import { useEffect } from "react"
import { LOCALE_HTML_TAG, type Locale } from "@/i18n/config"

/**
 * 把当前 locale 同步到 `document.documentElement.lang`。
 *
 * 为什么需要:root layout 在 [lang] 之上,SSR 时无法读到 locale 段,
 * 只能给一个默认值。这里在客户端补上当前 locale,保证 BCP47 标签和路由一致。
 *
 * 副作用幂等,放在 `[lang]/layout.tsx` 内,locale 变化即刻生效。
 */
export function HtmlLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = LOCALE_HTML_TAG[locale]
  }, [locale])

  return null
}
