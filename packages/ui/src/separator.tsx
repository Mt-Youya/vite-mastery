"use client"

import { Separator as Base } from "@base-ui/react/separator"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "./lib/cn.ts"

interface SeparatorProps extends ComponentPropsWithoutRef<typeof Base> {}

export function Separator({ className, orientation = "horizontal", ...rest }: SeparatorProps) {
  return (
    <Base
      orientation={orientation}
      className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
      {...rest}
    />
  )
}
