import { cn } from "@/lib/utils"

/**
 * 渲染文档对应 API 稳定性徽章,数据来自 frontmatter 的 apiStability。
 * 三色:stable 中性灰,rc 警告暖橙,experimental 危险绯红。
 * label / aria 文案由调用方按 locale 传入,样式预设留在组件内。
 */
export type Stability = "stable" | "rc" | "experimental"

export interface StabilityBadgeProps {
  stability: Stability
  label: string
  ariaLabel: string
  className?: string
}

const PRESETS: Record<Stability, { outer: string; dot: string }> = {
  stable: {
    outer: "border-border-strong bg-bg-subtle text-fg-muted dark:bg-slate-800/40",
    dot: "bg-success-500",
  },
  rc: {
    outer: "border-warning-500/50 bg-warning-500/10 text-warning-600 dark:text-warning-500",
    dot: "bg-warning-500",
  },
  experimental: {
    outer: "border-danger-500/50 bg-danger-500/10 text-danger-600 dark:text-danger-500",
    dot: "bg-danger-500",
  },
}

export function StabilityBadge({ stability, label, ariaLabel, className }: StabilityBadgeProps) {
  const preset = PRESETS[stability]
  return (
    <span
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "font-mono text-2xs tracking-wider",
        preset.outer,
        className
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", preset.dot)} />
      {label}
    </span>
  )
}
