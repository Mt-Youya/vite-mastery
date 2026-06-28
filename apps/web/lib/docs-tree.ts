/**
 * content-collections 输出 flat 文档数组,这里把它折成 sidebar 用的树:
 *
 *   PART 00 · 入门铺垫
 *     └─ 0.1 为什么需要 Vite
 *     └─ 0.2 五分钟跑通第一个 Vite 项目
 *   PART 01 · ...
 *
 * 加上 locale fallback:对每个 baseSlug,优先取目标 locale 的文档;
 * 缺失时回落到 CONTENT_FALLBACK_LOCALE,同时把 `isFallback: true` 标在节点上,
 * sidebar / 文档页可以用它显示提示徽章。
 */

import { CONTENT_FALLBACK_LOCALE, type Locale } from "@/i18n/config"
import { PARTS } from "./site-config"
import type { Doc } from "content-collections"

export type DocItem = Doc & { isFallback?: boolean }

export interface DocsTreeNode {
  part: (typeof PARTS)[number]
  docs: DocItem[]
}

/**
 * 给定 locale,从全集中挑出该 locale 的文档;缺失时回落到 CONTENT_FALLBACK_LOCALE。
 * 返回的每个 DocItem 都带 `isFallback` 标记。
 */
export function pickDocsForLocale(allDocs: Doc[], locale: Locale): DocItem[] {
  const bySlug = new Map<string, { primary?: Doc; fallback?: Doc }>()
  for (const doc of allDocs) {
    const bucket = bySlug.get(doc.slug) ?? {}
    if (doc.locale === locale) bucket.primary = doc
    if (doc.locale === CONTENT_FALLBACK_LOCALE) bucket.fallback = doc
    bySlug.set(doc.slug, bucket)
  }
  const out: DocItem[] = []
  for (const { primary, fallback } of bySlug.values()) {
    const chosen = primary ?? fallback
    if (!chosen) continue
    out.push({ ...chosen, isFallback: !primary && Boolean(fallback) })
  }
  return out
}

/** 把(已按 locale 过滤过的)docs 数组按 Part 分组、按 order 排序,过滤掉 draft */
export function buildDocsTree(docs: DocItem[]): DocsTreeNode[] {
  return PARTS.map((part) => ({
    part,
    docs: docs.filter((d) => d.part === part.id && !d.draft).sort((a, b) => a.order - b.order),
  }))
}

/** flat list,按 (part 顺序, order) 排,用于 prev/next 导航 */
export function flattenDocs(tree: DocsTreeNode[]): DocItem[] {
  return tree.flatMap((node) => node.docs)
}

/** 找出当前 slug 对应的文档,以及前后邻居 */
export function findDocWithSiblings(
  flat: DocItem[],
  slug: string
): { current: DocItem | null; prev: DocItem | null; next: DocItem | null } {
  const idx = flat.findIndex((d) => d.slug === slug)
  if (idx < 0) return { current: null, prev: null, next: null }
  return {
    current: flat[idx] ?? null,
    prev: idx > 0 ? (flat[idx - 1] ?? null) : null,
    next: idx < flat.length - 1 ? (flat[idx + 1] ?? null) : null,
  }
}

/**
 * 给面包屑用 —— part 标题和「文档」根标题由调用方按当前 locale 提供。
 */
export function getBreadcrumb(
  doc: DocItem,
  partTitle: string,
  partNo: string,
  docsRootLabel: string
): { label: string; href?: string }[] {
  return [
    { label: docsRootLabel, href: "/docs" },
    { label: `Part ${partNo} · ${partTitle}`, href: `/docs/${doc.part}` },
    { label: doc.title },
  ]
}
