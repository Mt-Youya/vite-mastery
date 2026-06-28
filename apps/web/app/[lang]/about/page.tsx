import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { SITE } from "@/lib/site-config"

interface AboutPageProps {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: "about" })
  return {
    title: `${t("metaTitle")} · ${SITE.name}`,
    description: t("metaDescription"),
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "about" })
  const tSite = await getTranslations({ locale: lang, namespace: "site" })
  const promises = t.raw("promises") as string[]
  const stack = t.raw("stack") as string[]

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">{t("eyebrow")}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{t("title")}</h1>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>{t("intro1")}</p>
        <p>
          <strong>{t("intro2Strong")}</strong>
          {t("intro2")}
        </p>

        <h2>{t("promiseTitle")}</h2>
        <ul>
          {promises.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{t("authorTitle")}</h2>
        <p>
          <strong>{SITE.author.name}</strong>({SITE.author.handle}) —— {tSite("authorBio")}
        </p>
        <p>{t("authorIntro")}</p>

        <h2>{t("contributeTitle")}</h2>
        <p>{t("contributeIntro")}</p>
        <ul>
          <li>
            <Link href={SITE.repo} target="_blank" rel="noopener noreferrer">
              {t("contributePr")}
            </Link>
          </li>
          <li>{t("contributeContact", { handle: SITE.author.handle })}</li>
        </ul>

        <h2>{t("stackTitle")}</h2>
        <p>{t("stackIntro")}</p>
        <ul>
          {stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-16 flex flex-wrap gap-4">
        <Link
          href={localizedHref("/docs", lang)}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          {t("ctaDocs")}
        </Link>
        <Link
          href={SITE.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-fg-muted hover:text-fg hover:border-border-strong transition-colors"
        >
          {t("ctaRepo")}
        </Link>
      </div>
    </div>
  )
}
