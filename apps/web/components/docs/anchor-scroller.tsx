"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { getAnchorTarget, notifyDocsHashChange, scrollToDocsHash } from "@/lib/docs-anchor"

function isPlainLeftClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

function findAnchorLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  return target.closest<HTMLAnchorElement>("a[href]")
}

function isSamePageHash(url: URL) {
  return (
    url.hash.length > 1 &&
    url.origin === window.location.origin &&
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  )
}

/**
 * 文档页锚点滚动控制器。
 * 拦截同页 hash 导航,补偿 sticky header 高度,并给用户触发的定位加平滑滚动。
 */
export function AnchorScroller() {
  const pathname = usePathname()

  useEffect(() => {
    let frame = 0

    function scheduleScroll(hash: string, behavior: ScrollBehavior) {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          if (scrollToDocsHash(hash, behavior)) {
            notifyDocsHashChange(hash)
          }
        })
      })
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return

      const link = findAnchorLink(event.target)
      if (!link) return

      const url = new URL(link.href)
      if (!isSamePageHash(url) || !getAnchorTarget(url.hash)) return

      event.preventDefault()
      window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`)
      scheduleScroll(url.hash, "smooth")
    }

    function handleHashChange() {
      const hash = window.location.hash
      if (!hash) {
        notifyDocsHashChange("")
        return
      }
      scheduleScroll(hash, "smooth")
    }

    if (window.location.hash) {
      scheduleScroll(window.location.hash, "auto")
    }

    document.addEventListener("click", handleClick)
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener("click", handleClick)
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [pathname])

  return null
}
