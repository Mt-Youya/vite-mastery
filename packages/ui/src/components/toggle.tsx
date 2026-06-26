"use client"

import { Toggle as Base } from "@base-ui/react/toggle"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "../lib/utils"

interface ToggleProps extends ComponentPropsWithoutRef<typeof Base> {
  size?: "sm" | "md" | "lg"
}

const SIZES: Record<NonNullable<ToggleProps["size"]>, string> = {
  sm: "h-8 px-2 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-base",
}

export function Toggle({ className, size = "md", ...rest }: ToggleProps) {
  return (
    <Base
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        "border border-transparent text-fg-muted",
        "transition-colors duration-base ease-out-quart",
        "hover:bg-bg-subtle hover:text-fg",
        "data-pressed:bg-bg-muted data-pressed:text-fg",
        "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        SIZES[size],
        className
      )}
      {...rest}
    />
  )
}
