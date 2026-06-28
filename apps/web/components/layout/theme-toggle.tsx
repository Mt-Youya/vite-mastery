"use client"

import { ComputerIcon, Moon02Icon, SunIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { IconButton, Popover } from "@vite-mastery/ui"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useTheme } from "@/components/layout/theme-provider"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light", labelKey: "themeLight", icon: SunIcon },
  { value: "dark", labelKey: "themeDark", icon: Moon02Icon },
  { value: "system", labelKey: "themeSystem", icon: ComputerIcon },
] as const

export function ThemeToggle() {
  const t = useTranslations("ui")
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const CurrentIcon = !mounted || resolvedTheme === "dark" ? Moon02Icon : SunIcon

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <IconButton aria-label={t("toggleTheme")} variant="ghost" size="sm">
            <HugeiconsIcon icon={CurrentIcon} className="size-4" strokeWidth={1.5} aria-hidden />
          </IconButton>
        }
      />
      <Popover.Content className="w-40 p-1">
        <div className="flex flex-col gap-0.5" role="radiogroup" aria-label={t("toggleTheme")}>
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
                {t(opt.labelKey)}
              </button>
            )
          })}
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
