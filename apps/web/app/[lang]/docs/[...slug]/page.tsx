import { MDXContent } from "@content-collections/mdx/react"
import { allDocs } from "content-collections"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { ComponentPropsWithoutRef } from "react"
import { useMDXComponents } from "@/hooks/use-mdx-components"
import { Breadcrumb } from "@/components/docs/breadcrumb"
import { FallbackBanner } from "@/components/docs/fallback-banner"
import { Pager } from "@/components/docs/pager"
import { StabilityBadge, type Stability } from "@/components/docs/stability-badge"
import { Toc } from "@/components/docs/toc"
import { VersionBadge } from "@/components/docs/version-badge"
import { LOCALES, type Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import {
  buildDocsTree,
  findDocWithSiblings,
  flattenDocs,
  getBreadcrumb,
  pickDocsForLocale,
  type DocItem,
} from "@/lib/docs-tree"
import { PARTS } from "@/lib/site-config"

interface PageProps {
  params: Promise<{ lang: Locale; slug: string[] }>
}

function localizeMdxHref(locale: Locale, href?: string) {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return href
  if (LOCALES.some((item) => href === `/${item}` || href.startsWith(`/${item}/`))) return href
  return localizedHref(href, locale)
}

function createLocalizedMdxAnchor(locale: Locale) {
  return function LocalizedMdxAnchor({ href, ...props }: ComponentPropsWithoutRef<"a">) {
    return <a {...props} href={localizeMdxHref(locale, href)} />
  }
}

/**
 * 动态生成所有文档页 + Part 总览页(每个 locale × 每个 slug)。
 *   /<lang>/docs/<part-id>                → Part 总览(列出 part 下所有 docs)
 *   /<lang>/docs/<part-id>/<chapter-slug> → 单篇文档
 */
export function generateStaticParams() {
  const slugSet = new Set<string>()
  for (const doc of allDocs as unknown as DocItem[]) {
    slugSet.add(doc.slug)
  }

  const params: { lang: Locale; slug: string[] }[] = []
  for (const lang of LOCALES) {
    for (const part of PARTS) {
      params.push({ lang, slug: [part.id] })
    }
    for (const slug of slugSet) {
      params.push({ lang, slug: slug.split("/") })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const joined = slug.join("/")
  const docs = pickDocsForLocale(allDocs as unknown as DocItem[], lang)
  const doc = docs.find((d) => d.slug === joined)
  if (doc) return { title: doc.title, description: doc.description }

  const part = PARTS.find((p) => p.id === slug[0])
  if (part) {
    const tParts = await getTranslations({ locale: lang, namespace: "parts" })
    return {
      title: `Part ${part.no} · ${tParts(`${part.id}.title`)}`,
      description: tParts(`${part.id}.summary`),
    }
  }
  return {}
}

export default async function DocsCatchAllPage({ params }: PageProps) {
  const { lang, slug } = await params
  setRequestLocale(lang)
  const joined = slug.join("/")

  const t = await getTranslations({ locale: lang, namespace: "docs" })
  const tParts = await getTranslations({ locale: lang, namespace: "parts" })

  const localized = pickDocsForLocale(allDocs as unknown as DocItem[], lang)
  const tree = buildDocsTree(localized)
  const flat = flattenDocs(tree)

  /** —— 单篇文档 —— */
  const { current, prev, next } = findDocWithSiblings(flat, joined)
  if (current) {
    const mdxComponents = useMDXComponents({ a: createLocalizedMdxAnchor(lang) })
    const part = PARTS.find((p) => p.id === current.part)
    const breadcrumb = getBreadcrumb(
      current,
      part ? tParts(`${part.id}.title`) : current.part,
      part?.no ?? "",
      t("breadcrumbDocsRoot")
    ).map((item) => (item.href ? { ...item, href: localizedHref(item.href, lang) } : item))

    const metaLine = current.readingTime
      ? t("meta.withReading", {
          chapter: current.chapter,
          level: current.difficulty,
          minutes: current.readingTime,
        })
      : t("meta.difficulty", { chapter: current.chapter, level: current.difficulty })

    return (
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
        <article className="min-w-0">
          <Breadcrumb items={breadcrumb} ariaLabel={t("breadcrumbAriaLabel")} />
          {current.isFallback ? <FallbackBanner /> : null}
          <header className="mt-4">
            <p className="font-mono text-xs tracking-wider text-fg-subtle tabular-nums">{metaLine}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {current.title}
            </h1>
            <p className="mt-3 max-w-prose text-base leading-relaxed text-pretty text-fg-muted">
              {current.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <VersionBadge
                version={current.viteVersion}
                ariaLabel={t("versionBadgeAria", { version: current.viteVersion })}
              />
              <StabilityBadge
                stability={current.apiStability as Stability}
                label={t(`stability.${current.apiStability}.label`)}
                ariaLabel={t(`stability.${current.apiStability}.aria`)}
              />
            </div>
          </header>
          <hr className="my-8 border-border" />
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXContent code={current.body} components={mdxComponents} />
          </div>
          <Pager
            prev={prev}
            next={next}
            locale={lang}
            prevLabel={t("pager.prev")}
            nextLabel={t("pager.next")}
            ariaLabel={t("pager.ariaLabel")}
          />
        </article>

        <aside aria-label={t("tocAriaLabel")} className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">
            <Toc headings={current.headings ?? []} title={t("tocTitle")} />
          </div>
        </aside>
      </div>
    )
  }

  /** —— Part 总览页 —— */
  const part = PARTS.find((p) => p.id === slug[0])
  if (part && slug.length === 1) {
    const docsInPart = flat.filter((d) => d.part === part.id)
    return (
      <article className="max-w-3xl">
        <Breadcrumb
          ariaLabel={t("breadcrumbAriaLabel")}
          items={[
            { label: t("breadcrumbDocsRoot"), href: localizedHref("/docs", lang) },
            { label: `Part ${part.no} · ${tParts(`${part.id}.title`)}` },
          ]}
        />
        <header className="mt-4">
          <p className="font-mono text-xs tracking-wider text-fg-subtle">PART {part.no}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {tParts(`${part.id}.title`)}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-pretty text-fg-muted">{tParts(`${part.id}.summary`)}</p>
        </header>

        {docsInPart.length === 0 ? (
          <p className="mt-12 rounded-md border border-dashed border-border p-6 text-sm text-fg-muted">
            {t("draftBlock")}
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {docsInPart.map((doc) => (
              <li key={doc.slug} className="py-4">
                <a href={localizedHref(`/docs/${doc.slug}`, lang)} className="grid gap-1">
                  <span className="font-mono text-xs text-fg-subtle tabular-nums">{doc.chapter}</span>
                  <span className="font-medium text-fg">{doc.title}</span>
                  <span className="text-sm text-fg-muted text-pretty">{doc.description}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    )
  }

  notFound()
}
