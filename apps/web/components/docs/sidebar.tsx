"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { DOCS_HASH_CHANGE_EVENT, getCurrentHash } from "@/lib/docs-anchor"
import { cn } from "@/lib/utils"
import type { DocsTreeNode } from "@/lib/docs-tree"

interface SidebarProps {
  tree: DocsTreeNode[]
}

/**
 * 文档 sidebar。
 *
 * 内化 baseline-ui:
 *  - aria-current="page" 在激活项上
 *  - 触发区域 ≥ 36px 高(桌面),button 完整覆盖 hit area
 *  - 折叠箭头用 transform 切换,不改 layout
 *
 * 内化 ui-ux-pro-max:
 *  - sticky 高度 = dvh,自身可滚动
 *  - 当前位置高亮用 weight + 颜色 + 左侧 indicator(非纯色彩)
 *  - 键盘:Tab / Enter / Space 由原生 button + Link 承担
 */
export function Sidebar({ tree }: SidebarProps) {
  const pathname = usePathname()
  const collapsed = useSidebarStore((s) => s.collapsed)
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed)
  const syncActivePart = useSidebarStore((s) => s.syncActivePart)
  const [hash, setHash] = useState("")
  const partIds = useMemo(() => tree.map((node) => node.part.id), [tree])
  const activePartId = useMemo(
    () =>
      tree.find((node) => pathname === `/docs/${node.part.id}` || pathname?.startsWith(`/docs/${node.part.id}/`))?.part
        .id,
    [pathname, tree]
  )

  useEffect(() => {
    function updateHash() {
      setHash(getCurrentHash())
    }

    updateHash()
    window.addEventListener("hashchange", updateHash)
    window.addEventListener(DOCS_HASH_CHANGE_EVENT, updateHash)

    return () => {
      window.removeEventListener("hashchange", updateHash)
      window.removeEventListener(DOCS_HASH_CHANGE_EVENT, updateHash)
    }
  }, [])

  useEffect(() => {
    if (!activePartId) return

    const sync = () => syncActivePart(activePartId, partIds)
    sync()

    const unsubscribe = useSidebarStore.persist.onFinishHydration(sync)
    return unsubscribe
  }, [activePartId, hash, partIds, syncActivePart])

  return (
    <nav aria-label="文档章节" className="text-sm">
      <ul className="space-y-6">
        {tree.map((node) => {
          const isCollapsed = collapsed.includes(node.part.id)
          const isPartActive = pathname?.startsWith(`/docs/${node.part.id}`)
          return (
            <li key={node.part.id} className="mb-3">
              <button
                type="button"
                onClick={() => toggleCollapsed(node.part.id)}
                aria-expanded={!isCollapsed}
                aria-controls={`part-${node.part.id}`}
                className={cn(
                  "flex w-full items-center gap-2 py-1.5 text-left",
                  "font-display text-xs font-semibold tracking-wider uppercase",
                  "transition-colors duration-base hover:text-fg",
                  isPartActive ? "text-fg" : "text-fg-subtle"
                )}
              >
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className={cn(
                    "size-3 transition-transform duration-base ease-out-quart",
                    isCollapsed && "-rotate-90"
                  )}
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",
                    isPartActive ? "text-brand-500" : "text-fg-subtle"
                  )}
                >
                  {node.part.no}
                </span>
                <span>{node.part.title}</span>
              </button>

              {!isCollapsed && node.docs.length > 0 && (
                <ul id={`part-${node.part.id}`} className="mt-1 ml-2 border-l border-border">
                  {node.docs.map((doc) => {
                    const isActive = pathname === `/docs/${doc.slug}`
                    return (
                      <li key={doc.slug}>
                        <Link
                          href={`/docs/${doc.slug}`}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "relative -ml-px block border-l-2 py-1.5 pr-2 pl-4 text-pretty",
                            "transition-colors duration-base ease-out-quart",
                            isActive
                              ? "border-primary font-medium text-fg"
                              : "border-transparent text-fg-muted hover:border-border-strong hover:text-fg"
                          )}
                        >
                          <span className="mr-2 font-mono text-2xs text-fg-subtle tabular-nums">{doc.chapter}</span>
                          {doc.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}

              {!isCollapsed && node.docs.length === 0 && (
                <p className="mt-1 ml-5 text-xs text-fg-subtle italic">本章正在编写</p>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
