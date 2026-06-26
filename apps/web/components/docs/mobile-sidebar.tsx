"use client"

import { Menu02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sheet } from "@vite-mastery/ui"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { DocsTreeNode } from "@/lib/docs-tree"
import { Sidebar } from "./sidebar"

/**
 * 移动端文档导航触发条:固定在文档正文顶部,点击展开左侧抽屉(里面是和桌面一样的 Sidebar)。
 * 仅在 md 以下渲染。
 */
export function MobileSidebar({ tree }: { tree: DocsTreeNode[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // 路由切换自动收起
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="mb-4 md:hidden">
      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Trigger
          render={
            <button
              type="button"
              aria-label="打开章节目录"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg-elevated px-3 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <HugeiconsIcon icon={Menu02Icon} className="size-4" strokeWidth={1.5} aria-hidden />
              <span>章节目录</span>
            </button>
          }
        />
        <Sheet.Content side="left" title="文档章节" description="14 个 Part · 涵盖核心机制到独家章节">
          <div className="mt-2">
            <Sidebar tree={tree} />
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  )
}
