"use client"

import { Menu02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { IconButton, Sheet } from "@vite-mastery/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { NAV_LINKS, SITE } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * 顶部导航的移动端抽屉:左划入 Sheet,内含主导航 + GitHub 链接。
 * 仅在 md 以下显示;桌面端 NAV_LINKS 已经直出。
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // 路由切换自动收起
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger
        render={
          <IconButton aria-label="打开导航菜单" variant="ghost" size="sm">
            <HugeiconsIcon icon={Menu02Icon} className="size-5" strokeWidth={1.5} aria-hidden />
          </IconButton>
        }
      />
      <Sheet.Content side="left" title="导航" description="Vite 8 中文学习指南">
        <nav aria-label="主导航" className="mt-2 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base transition-colors duration-base",
                  isActive ? "bg-bg-subtle font-medium text-fg" : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href={SITE.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-3 py-2.5 text-base text-fg-muted hover:bg-bg-subtle hover:text-fg"
          >
            GitHub ↗
          </Link>
        </nav>
      </Sheet.Content>
    </Sheet.Root>
  )
}
