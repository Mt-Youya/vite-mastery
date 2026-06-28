import { ArrowRight01Icon, GithubIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@vite-mastery/ui"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { SITE } from "@/lib/site-config"

interface HeroProps {
  locale: Locale
}

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "home.hero" })
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--color-primary) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          {t("titleA")}
          <span className="text-fg-muted">{t("titleB")}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[60ch] text-base leading-relaxed text-pretty text-fg-muted md:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={localizedHref("/docs", locale)}>
            <Button variant="primary" size="lg">
              {t("ctaPrimary")}
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={1.75} aria-hidden />
            </Button>
          </Link>
          <a href={SITE.repo} target="_blank" rel="noreferrer noopener">
            <Button variant="secondary" size="lg">
              <HugeiconsIcon icon={GithubIcon} className="size-4" strokeWidth={1.5} aria-hidden />
              {t("ctaSecondary")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
