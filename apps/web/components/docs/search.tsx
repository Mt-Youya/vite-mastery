"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Dialog, IconButton } from "@vite-mastery/ui"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PagefindResult {
  url: string
  meta: { title?: string }
  excerpt: string
}

interface PagefindApi {
  search: (query: string) => Promise<{
    results: { data: () => Promise<PagefindResult> }[]
  }>
}

declare global {
  interface Window {
    pagefind?: PagefindApi
    __pagefindLoading?: Promise<PagefindApi>
  }
}

function loadPagefind(): Promise<PagefindApi> {
  if (window.pagefind) return Promise.resolve(window.pagefind)
  if (window.__pagefindLoading) return window.__pagefindLoading

  window.__pagefindLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "/_pagefind/pagefind.js"
    script.async = true
    script.onload = () => {
      if (window.pagefind) {
        resolve(window.pagefind)
      } else {
        reject(new Error("Pagefind loaded without exposing an API."))
      }
    }
    script.onerror = () => reject(new Error("Pagefind index is not available."))
    document.head.appendChild(script)
  })

  return window.__pagefindLoading
}

/**
 * 全站搜索 —— 桌面 Cmd+K / Ctrl+K 唤起,移动端点放大镜按钮。
 *
 * 索引来源:`/_pagefind/pagefind.js`,在 `pnpm build` 后由 pagefind CLI 生成。
 * Dev 模式下索引不存在,UI 显示提示文案。
 */
export function Search({ compact = false }: { compact?: boolean } = {}) {
  const t = useTranslations("docs.search")
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PagefindResult[] | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "no-index" | "no-results">("idle")

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!open || !query.trim()) {
      setResults(null)
      setStatus("idle")
      return
    }
    let cancelled = false
    setStatus("loading")

    void (async () => {
      try {
        const api = await loadPagefind()
        const { results: raw } = await api.search(query)
        const data = await Promise.all(raw.slice(0, 10).map((r) => r.data()))
        if (!cancelled) {
          setResults(data)
          setStatus(data.length === 0 ? "no-results" : "idle")
        }
      } catch {
        if (!cancelled) setStatus("no-index")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [open, query])

  return (
    <>
      {compact ? (
        <IconButton aria-label={t("label")} variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <HugeiconsIcon icon={Search01Icon} className="size-4" strokeWidth={1.5} aria-hidden />
        </IconButton>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("label")}
          className={cn(
            "flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-border bg-bg-elevated px-3",
            "text-sm text-fg-subtle",
            "transition-colors duration-base hover:border-border-strong hover:text-fg",
            "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]"
          )}
        >
          <HugeiconsIcon icon={Search01Icon} className="size-4" strokeWidth={1.5} aria-hidden />
          <span className="flex-1 text-left">{t("shortcutLabel")}</span>
          <kbd className="font-mono text-[10px] text-fg-subtle">⌘K</kbd>
        </button>
      )}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content title={t("dialogTitle")} closable className="max-w-2xl">
          <Dialog.Body>
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              className={cn(
                "h-11 w-full rounded-md border border-border bg-bg px-3 text-base",
                "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]"
              )}
            />

            <div className="mt-4 min-h-40">
              {status === "no-index" ? (
                <p className="rounded-md border border-dashed border-border p-4 text-sm text-fg-muted">
                  {t("noIndexPrefix")}
                  <code className="font-mono text-xs">pnpm build</code>
                  {t("noIndexSuffix")}
                </p>
              ) : status === "loading" ? (
                <p className="text-sm text-fg-muted">{t("loading")}</p>
              ) : status === "no-results" ? (
                <p className="text-sm text-fg-muted">{t("noResults")}</p>
              ) : results && results.length > 0 ? (
                <ul className="divide-y divide-border">
                  {results.map((r) => (
                    <li key={r.url}>
                      <Link
                        href={r.url}
                        onClick={() => setOpen(false)}
                        className="block py-3 transition-colors hover:bg-bg-subtle"
                      >
                        <p className="font-medium text-fg">{r.meta.title ?? r.url}</p>
                        <p
                          className="mt-1 text-sm text-fg-muted text-pretty [&_mark]:bg-brand-200/60 [&_mark]:text-fg"
                          dangerouslySetInnerHTML={{ __html: r.excerpt }}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : !query ? (
                <p className="text-sm text-fg-subtle">
                  {t("hintPrefix")}
                  <code className="font-mono text-xs">resolveId</code>
                  {t("hintMiddle")}
                  <code className="font-mono text-xs">依赖预构建</code>
                  {t("hintSuffix")}
                </p>
              ) : null}
            </div>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}
