import { getTranslations, setRequestLocale } from "next-intl/server"
import { HmrDemo } from "@/components/interactive/hmr-demo"
import type { Locale } from "@/i18n/config"

interface HmrDemoShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function HmrDemoShowcase({ params }: HmrDemoShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.hmr-demo" })

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {"<HmrDemo>"} · {t("title")}
      </h2>
      <p className="mb-6 text-sm text-fg-muted">{t("description")}</p>
      <HmrDemo />
    </div>
  )
}
