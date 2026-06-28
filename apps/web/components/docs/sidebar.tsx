"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import type { Locale } from "@/i18n/config"
import { DOCS_HASH_CHANGE_EVENT, getCurrentHash } from "@/lib/docs-anchor"
import { localizedHref } from "@/lib/i18n-routing"
import { cn } from "@/lib/utils"
import type { DocsTreeNode } from "@/lib/docs-tree"

interface SidebarProps {
  tree: DocsTreeNode[]
  locale: Locale
}

/**
 * 文档 sidebar。Part 标题走 `parts.<id>.title` namespace,
 * 链接全部经过 localizedHref 加 locale 前缀。
 */
export function Sidebar({ tree, locale }: SidebarProps) {
  const t = useTranslations("docs")
  const tParts = useTranslations("parts")
  const pathname = usePathname()
  const collapsed = useSidebarStore((s) => s.collapsed)
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed)
  const syncActivePart = useSidebarStore((s) => s.syncActivePart)
  const [hash, setHash] = useState("")
  const partIds = useMemo(() => tree.map((node) => node.part.id), [tree])
  const activePartId = useMemo(() => {
    const docsRoot = localizedHref("/docs", locale)
    return tree.find(
      (node) => pathname === `${docsRoot}/${node.part.id}` || pathname?.startsWith(`${docsRoot}/${node.part.id}/`)
    )?.part.id
  }, [pathname, tree, locale])

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
    <nav aria-label={t("sidebarAriaLabel")} className="text-sm">
      <ul className="space-y-6">
        {tree.map((node) => {
          const isCollapsed = collapsed.includes(node.part.id)
          const partHref = localizedHref(`/docs/${node.part.id}`, locale)
          const isPartActive = pathname?.startsWith(partHref)
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
                <span>{tParts(`${node.part.id}.title`)}</span>
              </button>

              {!isCollapsed && node.docs.length > 0 && (
                <ul id={`part-${node.part.id}`} className="mt-1 ml-2 border-l border-border">
                  {node.docs.map((doc) => {
                    const docHref = localizedHref(`/docs/${doc.slug}`, locale)
                    const isActive = pathname === docHref
                    return (
                      <li key={doc.slug}>
                        <Link
                          href={docHref}
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
                          {doc.isFallback ? (
                            <span
                              className="ml-1.5 align-middle font-mono text-[9px] font-medium tracking-wider text-warning-600 uppercase dark:text-warning-500"
                              aria-hidden
                            >
                              zh
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}

              {!isCollapsed && node.docs.length === 0 && (
                <p className="mt-1 ml-5 text-xs text-fg-subtle italic">{t("draftLabel")}</p>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
