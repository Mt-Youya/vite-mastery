export const DOCS_HASH_CHANGE_EVENT = "vite-mastery:docs-hash-change"

const ANCHOR_GAP = 24
const HEADER_SELECTOR = "body > header"

export function getCurrentHash() {
  if (typeof window === "undefined") return ""
  return window.location.hash
}

export function decodeHash(hash: string) {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export function getAnchorTarget(hash: string) {
  const id = decodeHash(hash)
  if (!id) return null
  return document.getElementById(id)
}

export function scrollToDocsHash(hash: string, behavior: ScrollBehavior = "smooth") {
  const target = getAnchorTarget(hash)
  if (!target) return false

  const header = document.querySelector<HTMLElement>(HEADER_SELECTOR)
  const headerHeight = header?.getBoundingClientRect().height ?? 56
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - ANCHOR_GAP)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  window.scrollTo({
    top,
    behavior: reduceMotion ? "auto" : behavior,
  })

  return true
}

export function notifyDocsHashChange(hash: string) {
  window.dispatchEvent(new CustomEvent(DOCS_HASH_CHANGE_EVENT, { detail: { hash } }))
}
