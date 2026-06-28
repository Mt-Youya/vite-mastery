import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { SITE } from "@/lib/site-config"

interface ShowcaseLayoutProps {
  children: React.ReactNode
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

export async function generateMetadata({ params }: ShowcaseLayoutProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: "showcase" })
  return {
    title: `${t("title")} · ${SITE.name}`,
    description: t("lead"),
  }
}

export default async function ShowcaseLayout({ children, params }: ShowcaseLayoutProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase" })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">{t("eyebrow")}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-fg-muted sm:text-base">{t("lead")}</p>
      </header>

      <nav className="mb-10 flex flex-wrap gap-2">
        <Link
          href={localizedHref("/showcase", lang)}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted hover:border-border-strong hover:text-fg transition-colors"
        >
          {t("all")}
        </Link>
        {COMPONENT_IDS.map((id) => (
          <Link
            key={id}
            href={localizedHref(`/showcase/${id}`, lang)}
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-fg-muted hover:border-border-strong hover:text-fg transition-colors"
          >
            {t(`components.${id}.label`)}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  )
}
