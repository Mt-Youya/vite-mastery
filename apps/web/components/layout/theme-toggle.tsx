"use client"

import { ComputerIcon, Moon02Icon, SunIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { IconButton, Popover } from "@vite-mastery/ui"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light", label: "亮色", icon: SunIcon },
  { value: "dark", label: "暗色", icon: Moon02Icon },
  { value: "system", label: "跟随系统", icon: ComputerIcon },
] as const

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const CurrentIcon = !mounted || resolvedTheme === "dark" ? Moon02Icon : SunIcon

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <IconButton aria-label="切换主题" variant="ghost" size="sm">
            <HugeiconsIcon icon={CurrentIcon} className="size-4" strokeWidth={1.5} aria-hidden />
          </IconButton>
        }
      />
      <Popover.Content className="w-40 p-1">
        <div className="flex flex-col gap-0.5" role="radiogroup" aria-label="主题">
          {OPTIONS.map((opt) => {
            const active = theme === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm",
                  "transition-colors duration-base ease-out-quart",
                  "hover:bg-bg-subtle",
                  active && "bg-bg-subtle text-fg",
                  !active && "text-fg-muted"
                )}
              >
                <HugeiconsIcon icon={opt.icon} className="size-4" strokeWidth={1.5} aria-hidden />
                {opt.label}
              </button>
            )
          })}
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
