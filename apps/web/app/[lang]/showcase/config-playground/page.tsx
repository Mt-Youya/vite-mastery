import { getTranslations, setRequestLocale } from "next-intl/server"
import { ConfigPlayground } from "@/components/interactive/config-playground"
import type { Locale } from "@/i18n/config"

interface ConfigPlaygroundShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function ConfigPlaygroundShowcase({ params }: ConfigPlaygroundShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.config-playground" })

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {"<ConfigPlayground>"} · {t("title")}
      </h2>
      <p className="mb-6 text-sm text-fg-muted">{t("description")}</p>
      <ConfigPlayground />
    </div>
  )
}
