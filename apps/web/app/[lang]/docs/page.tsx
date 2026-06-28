import { allDocs } from "content-collections"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { buildDocsTree, pickDocsForLocale, type DocItem } from "@/lib/docs-tree"
import { PARTS } from "@/lib/site-config"

interface DocsIndexPageProps {
  params: Promise<{ lang: Locale }>
}

/**
 * /docs 入口 —— 章节总览。列出 14 个 Part 及其首篇文档作为入口。
 */
export default async function DocsIndexPage({ params }: DocsIndexPageProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "docsIndex" })
  const tParts = await getTranslations({ locale: lang, namespace: "parts" })

  const docs = pickDocsForLocale(allDocs as unknown as DocItem[], lang)
  const tree = buildDocsTree(docs)

  return (
    <article className="max-w-3xl">
      <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance">{t("title")}</h1>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-pretty text-fg-muted">{t("lead")}</p>

      <ul className="mt-10 divide-y divide-border border-y border-border">
        {tree.map(({ part, docs }) => {
          const partMeta = PARTS.find((p) => p.id === part.id)
          const firstDoc = docs[0]
          const target = localizedHref(firstDoc ? `/docs/${firstDoc.slug}` : `/docs/${part.id}`, lang)
          return (
            <li key={part.id} className="py-5">
              <Link href={target} className="grid items-baseline gap-2 md:grid-cols-[5rem_1fr_auto] md:gap-6">
                <span className="font-mono text-xs tracking-wider text-fg-subtle tabular-nums">
                  {t("partLabel")} {part.no}
                </span>
                <span>
                  <span className="block font-medium text-fg">{tParts(`${part.id}.title`)}</span>
                  <span className="block text-sm text-fg-muted text-pretty">{tParts(`${part.id}.summary`)}</span>
                </span>
                <span className="text-xs text-fg-subtle tabular-nums">
                  {t("progress", { done: docs.length, total: partMeta?.chapters ?? part.chapters })}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
