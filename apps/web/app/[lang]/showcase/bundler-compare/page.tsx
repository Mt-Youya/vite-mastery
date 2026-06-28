import { getTranslations, setRequestLocale } from "next-intl/server"
import { BundlerCompare } from "@/components/interactive/bundler-compare"
import type { Locale } from "@/i18n/config"

interface BundlerCompareShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function BundlerCompareShowcase({ params }: BundlerCompareShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.bundler-compare" })

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {"<BundlerCompare>"} · {t("title")}
      </h2>
      <p className="mb-6 text-sm text-fg-muted">{t("description")}</p>
      <BundlerCompare />
    </div>
  )
}
