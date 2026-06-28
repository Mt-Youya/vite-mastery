import { allDocs } from "content-collections"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { EXAMPLES, SITE } from "@/lib/site-config"

interface ExamplesPageProps {
  params: Promise<{ lang: Locale }>
}

function Difficulty({ level, ariaLabel }: { level: number; ariaLabel: string }) {
  return (
    <span aria-label={ariaLabel} className="font-mono text-[10px] text-fg-subtle">
      {"▮".repeat(level)}
      <span className="text-border-strong">{"▯".repeat(4 - level)}</span>
    </span>
  )
}

/** 根据 chapter("3.4"/"5.10" 等)反查文档 slug。配套教程章节没写时回落到 Part 首页。 */
function resolveDocHref(chapter: string, locale: Locale): string {
  const doc = allDocs.find((d) => d.chapter === chapter)
  if (doc) return localizedHref(`/docs/${doc.slug}`, locale)
  const partNo = (chapter.split(".")[0] ?? "").padStart(2, "0")
  const partSlug = allDocs.find((d) => d.part?.startsWith(`${partNo}-`))?.part
  return localizedHref(partSlug ? `/docs/${partSlug}` : "/docs", locale)
}

export async function generateMetadata({ params }: ExamplesPageProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: "examplesPage" })
  return {
    title: `${t("metaTitle")} · ${SITE.name}`,
    description: t("metaDescription"),
  }
}

export default async function ExamplesPage({ params }: ExamplesPageProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "examplesPage" })
  const tEx = await getTranslations({ locale: lang, namespace: "examplesData" })

  return (
    <div className="mx-auto max-w-doc px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">{t("eyebrow")}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted text-pretty">{t("lead")}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <Link
            key={ex.id}
            href={resolveDocHref(ex.chapter, lang)}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-6 transition-colors hover:border-border-strong hover:bg-bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-fg-subtle tabular-nums">
                {t("chapterLabel", { chapter: ex.chapter })}
              </span>
              <Difficulty level={ex.difficulty} ariaLabel={t("difficultyAria", { level: ex.difficulty })} />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {tEx(`${ex.id}.title`)}
              </h2>
              <p className="mt-1.5 text-sm text-fg-muted text-pretty">{tEx(`${ex.id}.blurb`)}</p>
            </div>
            <p className="mt-auto pt-3 border-t border-border text-xs text-fg-subtle">
              {t("outcomeLabel", { outcome: tEx(`${ex.id}.outcome`) })}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-dashed border-border bg-bg-subtle/50 px-8 py-10 text-center">
        <p className="text-sm text-fg-muted">
          {t("sourceNotePrefix")}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">examples/</code>
          {t("sourceNoteMiddle")}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">steps/</code>
          {t("sourceNoteAlso")}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">final/</code>
          {t("sourceNoteSuffix")}
        </p>
        <Link
          href={SITE.repo}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("sourceLink")}
        </Link>
      </div>
    </div>
  )
}
