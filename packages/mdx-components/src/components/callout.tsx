/**
 * <Callout type="note|tip|success|warning|danger" title="..."> ... </Callout>
 *
 * 文档里穿插的高亮块。type 决定左边框颜色、图标背景色、文字色。
 */

import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Fire02Icon,
  IdeaIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import { cn } from "@vite-mastery/ui"

export type CalloutType = "note" | "tip" | "success" | "warning" | "danger"

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const ICONS: Record<CalloutType, typeof InformationCircleIcon> = {
  note: InformationCircleIcon,
  tip: IdeaIcon,
  success: CheckmarkCircle02Icon,
  warning: Alert02Icon,
  danger: Fire02Icon,
}

interface CalloutStyle {
  /** 整体容器 */
  wrapper: string
  /** 图标容器背景 */
  iconBg: string
  /** 图标颜色 */
  iconColor: string
  /** 标题颜色 */
  titleColor: string
  /** 正文颜色 */
  bodyColor: string
}

const STYLES: Record<CalloutType, CalloutStyle> = {
  note: {
    // 亮色:accent(紫蓝);暗色:提高背景不透明度到 18% 让蓝紫色可见
    wrapper:
      "border-l-4 border-l-accent-400 border border-accent-200/70 bg-accent-50 " +
      "dark:border-l-accent-400 dark:border-accent-600/40 dark:bg-accent-500/[0.18]",
    iconBg: "bg-accent-100 dark:bg-accent-500/30",
    iconColor: "text-accent-500 dark:text-accent-300",
    titleColor: "text-accent-800 dark:text-accent-200",
    bodyColor: "text-accent-900 dark:text-accent-100/90",
  },
  tip: {
    // 亮色:brand(琥珀);暗色:同样 18% 不透明度
    wrapper:
      "border-l-4 border-l-brand-400 border border-brand-200/70 bg-brand-50 " +
      "dark:border-l-brand-400 dark:border-brand-600/40 dark:bg-brand-500/[0.18]",
    iconBg: "bg-brand-100 dark:bg-brand-500/30",
    iconColor: "text-brand-600 dark:text-brand-300",
    titleColor: "text-brand-800 dark:text-brand-200",
    bodyColor: "text-brand-900/90 dark:text-brand-100/90",
  },
  success: {
    wrapper:
      "border-l-4 border-l-success-500 border border-success-500/40 bg-success-500/10 " +
      "dark:border-l-success-500 dark:border-success-500/30 dark:bg-success-500/[0.18]",
    iconBg: "bg-success-500/20 dark:bg-success-500/30",
    iconColor: "text-success-600 dark:text-success-400",
    titleColor: "text-success-700 dark:text-success-300",
    bodyColor: "text-success-900 dark:text-success-100/90",
  },
  warning: {
    wrapper:
      "border-l-4 border-l-warning-500 border border-warning-500/40 bg-warning-500/10 " +
      "dark:border-l-warning-500 dark:border-warning-500/30 dark:bg-warning-500/[0.18]",
    iconBg: "bg-warning-500/20 dark:bg-warning-500/30",
    iconColor: "text-warning-600 dark:text-warning-400",
    titleColor: "text-warning-700 dark:text-warning-300",
    bodyColor: "text-warning-900 dark:text-warning-100/90",
  },
  danger: {
    wrapper:
      "border-l-4 border-l-danger-500 border border-danger-500/40 bg-danger-500/10 " +
      "dark:border-l-danger-500 dark:border-danger-500/30 dark:bg-danger-500/[0.18]",
    iconBg: "bg-danger-500/20 dark:bg-danger-500/30",
    iconColor: "text-danger-600 dark:text-danger-400",
    titleColor: "text-danger-700 dark:text-danger-300",
    bodyColor: "text-danger-900 dark:text-danger-100/90",
  },
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  const s = STYLES[type]
  const Icon = ICONS[type]

  return (
    <aside
      className={cn("not-prose my-6 flex gap-3 rounded-lg px-4 py-3.5 text-sm leading-relaxed", s.wrapper)}
      role="note"
    >
      {/* 图标:带颜色背景的小方块 */}
      <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md", s.iconBg)}>
        <HugeiconsIcon icon={Icon} className={cn("size-4", s.iconColor)} strokeWidth={2} aria-hidden />
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        {title ? <p className={cn("font-semibold tracking-tight", s.titleColor)}>{title}</p> : null}
        <div
          className={cn(
            "text-sm [&_p]:my-0 [&_p+p]:mt-2 [&_ul]:my-1 [&_li]:my-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
            s.bodyColor
          )}
        >
          {children}
        </div>
      </div>
    </aside>
  )
}
