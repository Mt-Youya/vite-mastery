"use client"

import { Menu02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { IconButton, Sheet } from "@vite-mastery/ui"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { NAV_LINKS, SITE } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  locale: Locale
}

/**
 * 顶部导航的移动端抽屉:左划入 Sheet,内含主导航 + GitHub 链接。
 * 仅在 md 以下显示;桌面端 NAV_LINKS 已经直出。
 */
export function MobileMenu({ locale }: MobileMenuProps) {
  const t = useTranslations("nav")
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger
        render={
          <IconButton aria-label={t("openMenu")} variant="ghost" size="sm">
            <HugeiconsIcon icon={Menu02Icon} className="size-5" strokeWidth={1.5} aria-hidden />
          </IconButton>
        }
      />
      <Sheet.Content side="left" title={t("mobileMenuTitle")} description={t("mobileMenuDescription")}>
        <nav aria-label={t("ariaPrimary")} className="mt-2 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const localized = localizedHref(link.href, locale)
            const isActive = pathname === localized || pathname?.startsWith(`${localized}/`)
            return (
              <Link
                key={link.id}
                href={localized}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base transition-colors duration-base",
                  isActive ? "bg-bg-subtle font-medium text-fg" : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                )}
              >
                {t(link.id)}
              </Link>
            )
          })}
          <Link
            href={SITE.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-3 py-2.5 text-base text-fg-muted hover:bg-bg-subtle hover:text-fg"
          >
            {t("github")} ↗
          </Link>
        </nav>
      </Sheet.Content>
    </Sheet.Root>
  )
}
