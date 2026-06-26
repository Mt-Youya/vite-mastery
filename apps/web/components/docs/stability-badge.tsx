import { cn } from "@/lib/utils"

/**
 * 渲染文档对应 API 稳定性徽章,数据来自 frontmatter 的 apiStability。
 * 三色:stable 中性灰,rc 警告暖橙,experimental 危险绯红。
 */
export type Stability = "stable" | "rc" | "experimental"

export interface StabilityBadgeProps {
  stability: Stability
  className?: string
}

const PRESETS: Record<Stability, { label: string; aria: string; outer: string; dot: string }> = {
  stable: {
    label: "Stable",
    aria: "API 稳定",
    outer: "border-border-strong bg-bg-subtle text-fg-muted dark:bg-slate-800/40",
    dot: "bg-success-500",
  },
  rc: {
    label: "RC",
    aria: "API 处于 RC 阶段,可能在未来版本中调整",
    outer: "border-warning-500/50 bg-warning-500/10 text-warning-600 dark:text-warning-500",
    dot: "bg-warning-500",
  },
  experimental: {
    label: "Experimental",
    aria: "API 为实验性,生产环境慎用",
    outer: "border-danger-500/50 bg-danger-500/10 text-danger-600 dark:text-danger-500",
    dot: "bg-danger-500",
  },
}

export function StabilityBadge({ stability, className }: StabilityBadgeProps) {
  const preset = PRESETS[stability]
  return (
    <span
      aria-label={preset.aria}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "font-mono text-2xs tracking-wider",
        preset.outer,
        className
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", preset.dot)} />
      {preset.label}
    </span>
  )
}
