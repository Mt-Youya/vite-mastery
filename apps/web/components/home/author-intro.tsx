import { getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/config"
import { SITE } from "@/lib/site-config"

interface AuthorIntroProps {
  locale: Locale
}

export async function AuthorIntro({ locale }: AuthorIntroProps) {
  const t = await getTranslations({ locale, namespace: "home.authorIntro" })
  return (
    <section className="mx-auto max-w-prose px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">{t("eyebrow")}</p>

      <blockquote className="mt-6 font-display text-2xl leading-snug tracking-tight text-balance md:text-3xl">
        {t("quote")}
      </blockquote>

      <p className="mt-6 text-sm leading-relaxed text-pretty text-fg-muted">{t("bio")}</p>

      <div className="mt-6 flex items-center gap-4 text-sm text-fg-muted">
        <span className="font-medium text-fg">{SITE.author.name}</span>
        <span className="text-fg-subtle">·</span>
        <span className="font-mono text-xs">{SITE.author.handle}</span>
      </div>
    </section>
  )
}
