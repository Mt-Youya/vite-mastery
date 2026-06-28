import { getTranslations, setRequestLocale } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"

interface ShowcasePageProps {
  params: Promise<{ lang: Locale }>
}

const COMPONENT_IDS = [
  "v7-note",
  "bundler-compare",
  "hook-explorer",
  "plugin-pipeline",
  "hmr-demo",
  "environment-explorer",
  "config-playground",
  "dep-graph",
] as const

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase" })

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COMPONENT_IDS.map((id) => (
        <Link
          key={id}
          href={localizedHref(`/showcase/${id}`, lang)}
          className="group flex flex-col gap-2 rounded-xl border border-border bg-bg-elevated p-5 transition-colors hover:border-border-strong hover:bg-bg-muted/30"
        >
          <p className="font-mono text-sm font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {"<"}
            {t(`components.${id}.label`)}
            {" />"}
          </p>
          <p className="text-sm text-fg-muted leading-relaxed">{t(`components.${id}.desc`)}</p>
        </Link>
      ))}
    </div>
  )
}
