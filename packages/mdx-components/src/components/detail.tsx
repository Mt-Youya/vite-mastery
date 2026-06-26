/**
 * <Detail summary="..."> ... </Detail> —— 可折叠区域
 *
 * 原生 <details> 的样式包装,自带翻转动画的 chevron。
 */

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import { cn } from "@vite-mastery/ui"

interface DetailProps {
  summary: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Detail({ summary, defaultOpen = false, children }: DetailProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group my-4 rounded-lg border border-border bg-bg-elevated",
        "transition-colors duration-base",
        "open:bg-bg-subtle"
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-2 px-4 py-3",
          "text-sm font-medium select-none",
          "focus-visible:outline-none"
        )}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-4 text-fg-muted transition-transform duration-base group-open:rotate-90"
          strokeWidth={1.5}
          aria-hidden
        />
        {summary}
      </summary>
      <div className="border-t border-border px-4 py-3 text-sm leading-relaxed">{children}</div>
    </details>
  )
}
