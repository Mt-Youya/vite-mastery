"use client"

/**
 * <V7Note> —— Vite 7 行为差异折叠块。
 *
 * 折叠态:一行 hint,左侧 V7 徽章(muted),右侧展开箭头。
 * 展开态:warning 边框,内容区,底部迁移路径建议。
 *
 * 使用方式:
 *   <V7Note title="Vite 7 行为差异">
 *     在 Vite 7 中,... 而 Vite 8 改为 ...
 *   </V7Note>
 */

import { useState } from "react"
import { Collapsible } from "@vite-mastery/ui"
import { cn } from "@vite-mastery/ui"

export interface V7NoteProps {
  /** 折叠栏标题,默认 "Vite 7 行为差异" */
  title?: string
  /** 展开按钮 aria 文案 */
  expandLabel?: string
  /** 折叠按钮 aria 文案 */
  collapseLabel?: string
  children: React.ReactNode
}

export function V7Note({
  title = "Vite 7 行为差异",
  expandLabel = "展开",
  collapseLabel = "折叠",
  children,
}: V7NoteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "not-prose my-6 rounded-lg border transition-colors duration-[--duration-base]",
        open ? "border-warning-500/40 dark:border-warning-500/30" : "border-warning-200/60 dark:border-warning-800/30"
      )}
    >
      <Collapsible.Trigger
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm",
          "text-warning-700 dark:text-warning-400",
          "transition-colors duration-[--duration-fast]",
          "hover:bg-warning-50 dark:hover:bg-warning-900/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning-400/50",
          open && "rounded-b-none"
        )}
        aria-label={`${open ? collapseLabel : expandLabel}:${title}`}
      >
        {/* V7 徽章:展开后去灰度 */}
        <span
          className={cn(
            "flex h-5 w-8 shrink-0 items-center justify-center rounded-sm",
            "font-mono text-[10px] font-bold tracking-tight",
            "bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-400",
            "transition-all duration-[--duration-base]",
            open ? "opacity-100" : "opacity-60 grayscale"
          )}
          aria-hidden
        >
          V7
        </span>

        <span className="flex-1 text-left font-medium">{title}</span>

        {/* 展开箭头 */}
        <svg
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-[--duration-base]",
            open ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Collapsible.Trigger>

      <Collapsible.Panel>
        <div
          className={cn(
            "border-t border-warning-200/60 dark:border-warning-800/30",
            "px-4 py-4",
            "text-sm text-fg-muted",
            "[&_code]:rounded [&_code]:bg-warning-100/70 [&_code]:px-1 [&_code]:py-0.5",
            "[&_code]:font-mono [&_code]:text-warning-800",
            "dark:[&_code]:bg-warning-900/30 dark:[&_code]:text-warning-300"
          )}
        >
          {children}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}
