/**
 * content-collections 输出 flat 文档数组,这里把它折成 sidebar 用的树:
 *
 *   PART 00 · 入门铺垫
 *     └─ 0.1 为什么需要 Vite
 *     └─ 0.2 五分钟跑通第一个 Vite 项目
 *   PART 01 · ...
 */

import { PARTS } from "./site-config";
import type { Doc } from "content-collections";

export type DocItem = Doc;

export interface DocsTreeNode {
  part: (typeof PARTS)[number];
  docs: DocItem[];
}

/** 把 content-collections 的 docs 数组按 Part 分组、按 order 排序,过滤掉 draft */
export function buildDocsTree(docs: DocItem[]): DocsTreeNode[] {
  return PARTS.map((part) => ({
    part,
    docs: docs
      .filter((d) => d.part === part.id && !d.draft)
      .sort((a, b) => a.order - b.order),
  }));
}

/** flat list,按 (part 顺序, order) 排,用于 prev/next 导航 */
export function flattenDocs(tree: DocsTreeNode[]): DocItem[] {
  return tree.flatMap((node) => node.docs);
}

/** 找出当前 slug 对应的文档,以及前后邻居 */
export function findDocWithSiblings(
  flat: DocItem[],
  slug: string,
): { current: DocItem | null; prev: DocItem | null; next: DocItem | null } {
  const idx = flat.findIndex((d) => d.slug === slug);
  if (idx < 0) return { current: null, prev: null, next: null };
  return {
    current: flat[idx] ?? null,
    prev: idx > 0 ? (flat[idx - 1] ?? null) : null,
    next: idx < flat.length - 1 ? (flat[idx + 1] ?? null) : null,
  };
}

/** 给面包屑用:slug → [Part 标题, doc 标题] */
export function getBreadcrumb(doc: DocItem): { label: string; href?: string }[] {
  const part = PARTS.find((p) => p.id === doc.part);
  return [
    { label: "文档", href: "/docs" },
    ...(part
      ? [{ label: `Part ${part.no} · ${part.title}`, href: `/docs/${part.id}` }]
      : []),
    { label: doc.title },
  ];
}
