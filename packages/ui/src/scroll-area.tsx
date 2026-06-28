"use client"

import { ScrollArea as Base } from "@base-ui/react/scroll-area"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "./lib/cn.ts"

interface ScrollAreaProps extends ComponentPropsWithoutRef<typeof Base.Root> {
  children: ReactNode
  /** 容器最大高度,默认 100% */
  maxHeight?: string
}

function Root({ className, children, maxHeight = "100%", style, ...rest }: ScrollAreaProps) {
  return (
    <Base.Root className={cn("relative overflow-hidden", className)} style={{ maxHeight, ...style }} {...rest}>
      <Base.Viewport className="size-full">{children}</Base.Viewport>
      <Base.Scrollbar orientation="vertical" className="flex w-2 touch-none select-none p-px">
        <Base.Thumb className="flex-1 rounded-full bg-border-strong hover:bg-fg-muted/40" />
      </Base.Scrollbar>
      <Base.Scrollbar orientation="horizontal" className="flex h-2 touch-none select-none p-px">
        <Base.Thumb className="flex-1 rounded-full bg-border-strong hover:bg-fg-muted/40" />
      </Base.Scrollbar>
      <Base.Corner className="bg-bg-subtle" />
    </Base.Root>
  )
}

export const ScrollArea = {
  Root,
}
