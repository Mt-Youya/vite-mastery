import { useTranslations } from "next-intl"
import { Alert02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

/**
 * 当用户访问的 locale 没有对应翻译时,顶端展示这个 banner 告知"内容来自 fallback 语言"。
 * 视觉上克制 —— 一个细的暖橙边框,左侧 icon + 双行文字,不抢眼但醒目。
 */
export function FallbackBanner() {
  const t = useTranslations("docs.fallbackBanner")
  return (
    <div
      role="status"
      className="mt-4 flex items-start gap-3 rounded-md border border-warning-500/40 bg-warning-500/5 px-4 py-3"
    >
      <HugeiconsIcon
        icon={Alert02Icon}
        className="mt-0.5 size-4 shrink-0 text-warning-600 dark:text-warning-500"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="space-y-1">
        <p className="text-sm font-medium text-fg">{t("title")}</p>
        <p className="text-xs text-fg-muted">{t("body")}</p>
      </div>
    </div>
  )
}
