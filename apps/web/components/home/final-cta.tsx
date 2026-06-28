import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@vite-mastery/ui"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"

interface FinalCtaProps {
  locale: Locale
}

export async function FinalCta({ locale }: FinalCtaProps) {
  const t = await getTranslations({ locale, namespace: "home.finalCta" })
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24 md:py-32">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-5xl">{t("title")}</h2>
        <p className="max-w-prose text-base text-pretty text-fg-muted">{t("lead")}</p>
        <Link href={localizedHref("/docs/00-getting-started/01-why-vite", locale)}>
          <Button variant="primary" size="lg">
            {t("cta")}
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={1.75} aria-hidden />
          </Button>
        </Link>
      </div>
    </section>
  )
}
