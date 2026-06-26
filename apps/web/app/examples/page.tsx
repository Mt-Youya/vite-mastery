import { allDocs } from "content-collections"
import type { Metadata } from "next"
import Link from "next/link"
import { EXAMPLES } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "实战项目 · vite-mastery",
  description: "10 个配套实战项目,涵盖虚拟模块、Markdown 加载器、图片优化、SSR、组件库等。",
}

function Difficulty({ level }: { level: number }) {
  return (
    <span aria-label={`难度 ${level} / 4`} className="font-mono text-[10px] text-fg-subtle">
      {"▮".repeat(level)}
      <span className="text-border-strong">{"▯".repeat(4 - level)}</span>
    </span>
  )
}

/** 根据 chapter("3.4"/"5.10" 等)反查文档 slug。配套教程章节没写时回落到 Part 首页。 */
function resolveDocHref(chapter: string): string {
  const doc = allDocs.find((d) => d.chapter === chapter)
  if (doc) return `/docs/${doc.slug}`
  const partNo = (chapter.split(".")[0] ?? "").padStart(2, "0")
  const partSlug = allDocs.find((d) => d.part?.startsWith(`${partNo}-`))?.part
  return partSlug ? `/docs/${partSlug}` : "/docs"
}

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-doc px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">实战项目</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance">
          不只是看懂,要能写出来。
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted text-pretty">
          10 个循序渐进的实战项目——从最小可跑的虚拟模块插件,到完整的跨框架组件库和 Environment API 多环境构建。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <Link
            key={ex.id}
            href={resolveDocHref(ex.chapter)}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-6 transition-colors hover:border-border-strong hover:bg-bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-fg-subtle tabular-nums">ch.{ex.chapter}</span>
              <Difficulty level={ex.difficulty} />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {ex.title}
              </h2>
              <p className="mt-1.5 text-sm text-fg-muted text-pretty">{ex.blurb}</p>
            </div>
            <p className="mt-auto pt-3 border-t border-border text-xs text-fg-subtle">产出:{ex.outcome}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-dashed border-border bg-bg-subtle/50 px-8 py-10 text-center">
        <p className="text-sm text-fg-muted">
          各实战项目的代码在仓库的{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">examples/</code>{" "}
          目录下。每个项目包含分步代码{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">steps/</code> 和最终完成版{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">final/</code>。
        </p>
        <Link
          href="https://github.com/Mt-Youya/vite-mastery"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          在 GitHub 查看源码 →
        </Link>
      </div>
    </div>
  )
}
