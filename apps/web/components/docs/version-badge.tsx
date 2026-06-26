import { cn } from "@/lib/utils"

/**
 * 渲染文档对应的 Vite 演示版本徽章,数据来自 frontmatter 的 viteVersion。
 * 视觉:brand 暖橙描边的小 pill,无填充,字号 2xs,与 stability 徽章并排。
 */
export interface VersionBadgeProps {
  /** 形如 "8.1" / "8.0" / "7.3" */
  version: string
  className?: string
}

export function VersionBadge({ version, className }: VersionBadgeProps) {
  return (
    <span
      aria-label={`示例基于 Vite ${version}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "border border-brand-600/40 bg-brand-50/40",
        "font-mono text-2xs tracking-wider tabular-nums text-brand-700",
        "dark:border-brand-500/40 dark:bg-brand-900/30",
        "dark:text-brand-300",
        className
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      Vite {version}
    </span>
  )
}
