/**
 * <Steps> ... </Steps> —— 有编号的步骤列表
 *
 * 子节点为若干 <h3> + content;Steps 给每个 h3 加左侧编号徽章和竖线。
 */

import type { ReactNode } from "react"
import { cn } from "@vite-mastery/ui"

interface StepsProps {
  children: ReactNode
}

export function Steps({ children }: StepsProps) {
  return (
    <div
      className={cn(
        "ml-4 border-l border-border pl-6",
        "[counter-reset:step]",
        "[&>h3]:relative [&>h3]:[counter-increment:step]",
        // 编号气泡:绝对定位到 h3 左侧
        "[&>h3]:before:absolute [&>h3]:before:-left-9 [&>h3]:before:flex",
        "[&>h3]:before:size-7 [&>h3]:before:items-center [&>h3]:before:justify-center",
        "[&>h3]:before:rounded-full [&>h3]:before:border [&>h3]:before:border-border",
        "[&>h3]:before:bg-bg-elevated [&>h3]:before:font-mono [&>h3]:before:text-xs",
        "[&>h3]:before:font-semibold [&>h3]:before:text-fg-muted",
        "[&>h3]:before:content-[counter(step)]"
      )}
    >
      {children}
    </div>
  )
}
