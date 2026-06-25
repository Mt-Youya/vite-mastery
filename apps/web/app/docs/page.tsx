import { allDocs } from "content-collections";
import Link from "next/link";
import { buildDocsTree, type DocItem } from "@/lib/docs-tree";
import { PARTS } from "@/lib/site-config";

/**
 * /docs 入口 —— 章节总览。列出 11 个 Part 及其首篇文档作为入口。
 */
export default function DocsIndexPage() {
  const tree = buildDocsTree(allDocs as unknown as DocItem[]);

  return (
    <article className="max-w-3xl">
      <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">文档</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance">
        从这里开始读
      </h1>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-pretty text-fg-muted">
        十二章按学习路径排列。建议按顺序读,主轴(Plugin / Hooks / HMR)是全书最重要的部分。
      </p>

      <ul className="mt-10 divide-y divide-border border-y border-border">
        {tree.map(({ part, docs }) => {
          const partMeta = PARTS.find((p) => p.id === part.id);
          const firstDoc = docs[0];
          const target = firstDoc ? `/docs/${firstDoc.slug}` : `/docs/${part.id}`;
          return (
            <li key={part.id} className="py-5">
              <Link
                href={target}
                className="grid items-baseline gap-2 md:grid-cols-[5rem_1fr_auto] md:gap-6"
              >
                <span className="font-mono text-xs tracking-wider text-fg-subtle tabular-nums">
                  PART {part.no}
                </span>
                <span>
                  <span className="block font-medium text-fg">{part.title}</span>
                  <span className="block text-sm text-fg-muted text-pretty">
                    {partMeta?.summary}
                  </span>
                </span>
                <span className="text-xs text-fg-subtle tabular-nums">
                  {docs.length} / {part.chapters} 节
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
