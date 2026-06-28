/**
 * <Callout type="note|tip|warning|danger" title="..."> ... </Callout>
 *
 * 文档里穿插的高亮块。type 决定颜色与图标。
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

const STYLES: Record<CalloutType, string> = {
  note: "border-accent-300 bg-accent-50/60 text-accent-900 dark:border-accent-800 dark:bg-accent-950/40 dark:text-accent-100",
  tip: "border-brand-300 bg-brand-50/60 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100",
  success:
    "border-success-500/40 bg-success-500/10 text-success-600 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-500",
  warning:
    "border-warning-500/40 bg-warning-500/10 text-warning-600 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-500",
  danger:
    "border-danger-500/40 bg-danger-500/10 text-danger-600 dark:border-danger-500/40 dark:bg-danger-500/10 dark:text-danger-500",
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  return (
    <aside
      className={cn("my-6 flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed", STYLES[type])}
      role="note"
    >
      <HugeiconsIcon icon={ICONS[type]} className="mt-0.5 size-5 shrink-0" strokeWidth={1.5} aria-hidden />
      <div className="flex-1 space-y-1">
        {title ? <div className="font-semibold tracking-tight">{title}</div> : null}
        <div className="[&_p]:my-0 [&_p+p]:mt-2">{children}</div>
      </div>
    </aside>
  )
}
