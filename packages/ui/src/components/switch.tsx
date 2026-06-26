"use client"

import { Switch as Base } from "@base-ui/react/switch"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "../lib/utils"

interface SwitchProps extends ComponentPropsWithoutRef<typeof Base.Root> {}

export function Switch({ className, ...rest }: SwitchProps) {
  return (
    <Base.Root
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
        "border border-border bg-bg-muted",
        "transition-colors duration-base ease-out-quart",
        "data-checked:bg-primary data-checked:border-primary",
        "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    >
      <Base.Thumb
        className={cn(
          "pointer-events-none size-4 translate-x-0.5 rounded-full bg-white shadow-sm",
          "transition-transform duration-base ease-out-expo",
          "data-checked:translate-x-4.5"
        )}
      />
    </Base.Root>
  )
}
