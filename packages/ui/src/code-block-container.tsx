/**
 * CodeBlockContainer —— 纯样式包装,接受 Shiki 渲染好的 HTML 作为 children。
 *
 * 不耦合 Shiki(那是 @vite-mastery/mdx-components 的事),
 * 这里只负责外壳:文件名 tag、复制按钮位、视觉变体(default / diff)。
 */

import type { HTMLAttributes, ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./lib/cn.ts"

const containerVariants = cva(
  ["group/code relative my-6 overflow-hidden rounded-lg border", "bg-bg-elevated text-sm"],
  {
    variants: {
      variant: {
        default: "border-border",
        diff: "border-accent-300 dark:border-accent-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CodeBlockContainerProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  filename?: string
  lang?: string
  /** copy 按钮等右上角操作槽 */
  copySlot?: ReactNode
}

export function CodeBlockContainer({
  filename,
  lang,
  variant,
  copySlot,
  className,
  children,
  ...rest
}: CodeBlockContainerProps) {
  const hasHeader = Boolean(filename || lang || copySlot)
  return (
    <div className={cn(containerVariants({ variant }), className)} {...rest}>
      {hasHeader ? (
        <div className="flex items-center justify-between gap-2 border-b border-border bg-bg-subtle px-3 py-1.5">
          <div className="flex items-center gap-2 font-mono text-xs text-fg-muted">
            {filename ? <span className="text-fg">{filename}</span> : null}
            {lang ? (
              <span className="rounded bg-bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">{lang}</span>
            ) : null}
          </div>
          {copySlot ? <div className="opacity-0 transition group-hover/code:opacity-100">{copySlot}</div> : null}
        </div>
      ) : null}
      <div className="overflow-x-auto text-[13px] leading-relaxed [&>pre]:m-0 [&>pre]:bg-transparent [&>pre]:p-4">
        {children}
      </div>
    </div>
  )
}
