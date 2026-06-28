import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { SITE } from "@/lib/site-config"

interface PlaygroundPageProps {
  params: Promise<{ lang: Locale }>
}

interface FeatureEntry {
  icon: string
  title: string
  desc: string
}

export async function generateMetadata({ params }: PlaygroundPageProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: "playground" })
  return {
    title: `${t("metaTitle")} · ${SITE.name}`,
    description: t("metaDescription"),
  }
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "playground" })
  const features = t.raw("features") as FeatureEntry[]
  const isDev = process.env.NODE_ENV === "development"

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">{t("eyebrow")}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={SITE.playgroundUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90"
          >
            <span>{t("ctaOpen")}</span>
            <span aria-hidden>↗</span>
          </a>
          <Link
            href={localizedHref("/docs/03-plugin-system/04-virtual-modules-plugin", lang)}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-6 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            {t("ctaTutorial")}
          </Link>
        </div>

        {isDev && (
          <p className="mt-4 text-xs text-fg-subtle">
            {t("devHintPrefix")}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono">
              pnpm --filter @vite-mastery/playground dev
            </code>
            {t("devHintSuffix")}
          </p>
        )}
      </header>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-bg-elevated p-5">
            <div className="text-2xl">{f.icon}</div>
            <h2 className="mt-3 font-display text-base font-semibold text-fg">{f.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-dashed border-border bg-bg-subtle/50 px-6 py-8 text-center text-sm text-fg-muted">
        <p>
          {t("sourceNotePrefix")}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono">apps/playground/</code>
          {t("sourceNoteSuffix")}
        </p>
        <a
          href={`${SITE.repo}/tree/main/apps/playground`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-2 inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
        >
          {t("sourceLink")}
        </a>
      </div>
    </div>
  )
}
