import { MDXContent } from "@content-collections/mdx/react";
import { allDocs } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useMDXComponents } from "@/mdx-components";
import { Breadcrumb } from "@/components/docs/breadcrumb";
import { Pager } from "@/components/docs/pager";
import { Toc } from "@/components/docs/toc";
import {
  buildDocsTree,
  findDocWithSiblings,
  flattenDocs,
  getBreadcrumb,
  type DocItem,
} from "@/lib/docs-tree";
import { PARTS } from "@/lib/site-config";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * 动态生成所有文档页 + Part 总览页。
 *   /docs/<part-id>                → Part 总览(列出 part 下所有 docs)
 *   /docs/<part-id>/<chapter-slug> → 单篇文档
 */
export function generateStaticParams() {
  const docPages = (allDocs as unknown as DocItem[]).map((d) => ({
    slug: d.slug.split("/"),
  }));
  const partPages = PARTS.map((p) => ({ slug: [p.id] }));
  return [...partPages, ...docPages];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const joined = slug.join("/");
  const doc = (allDocs as unknown as DocItem[]).find((d) => d.slug === joined);
  if (doc) {
    return { title: doc.title, description: doc.description };
  }
  const part = PARTS.find((p) => p.id === slug[0]);
  if (part) {
    return { title: `Part ${part.no} · ${part.title}`, description: part.summary };
  }
  return {};
}

export default async function DocsCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const joined = slug.join("/");
  const flat = flattenDocs(buildDocsTree(allDocs as unknown as DocItem[]));

  // —— 单篇文档 ——
  const { current, prev, next } = findDocWithSiblings(flat, joined);
  if (current) {
    const mdxComponents = useMDXComponents({});
    return (
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
        <article className="min-w-0">
          <Breadcrumb items={getBreadcrumb(current)} />
          <header className="mt-4">
            <p className="font-mono text-xs tracking-wider text-fg-subtle tabular-nums">
              {current.chapter} · 难度 {current.difficulty}/4
              {current.readingTime ? ` · ${current.readingTime} 分钟阅读` : null}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {current.title}
            </h1>
            <p className="mt-3 max-w-prose text-base leading-relaxed text-pretty text-fg-muted">
              {current.description}
            </p>
          </header>
          <hr className="my-8 border-border" />
          <div className="prose-doc max-w-prose">
            <MDXContent code={current.body} components={mdxComponents} />
          </div>
          <Pager prev={prev} next={next} />
        </article>

        <aside aria-label="本页大纲" className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">
            <Toc headings={current.headings ?? []} />
          </div>
        </aside>
      </div>
    );
  }

  // —— Part 总览页 ——
  const part = PARTS.find((p) => p.id === slug[0]);
  if (part && slug.length === 1) {
    const docsInPart = flat.filter((d) => d.part === part.id);
    return (
      <article className="max-w-3xl">
        <Breadcrumb
          items={[{ label: "文档", href: "/docs" }, { label: `Part ${part.no} · ${part.title}` }]}
        />
        <header className="mt-4">
          <p className="font-mono text-xs tracking-wider text-fg-subtle">PART {part.no}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {part.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-pretty text-fg-muted">
            {part.summary}
          </p>
        </header>

        {docsInPart.length === 0 ? (
          <p className="mt-12 rounded-md border border-dashed border-border p-6 text-sm text-fg-muted">
            本章正在编写,稍后回来。
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {docsInPart.map((doc) => (
              <li key={doc.slug} className="py-4">
                <a href={`/docs/${doc.slug}`} className="grid gap-1">
                  <span className="font-mono text-xs text-fg-subtle tabular-nums">
                    {doc.chapter}
                  </span>
                  <span className="font-medium text-fg">{doc.title}</span>
                  <span className="text-sm text-fg-muted text-pretty">{doc.description}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    );
  }

  notFound();
}
