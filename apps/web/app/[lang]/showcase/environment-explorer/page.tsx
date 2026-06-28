import { getTranslations, setRequestLocale } from "next-intl/server"
import { EnvironmentExplorer } from "@/components/interactive/environment-explorer"
import type { Locale } from "@/i18n/config"

interface EnvironmentExplorerShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function EnvironmentExplorerShowcase({ params }: EnvironmentExplorerShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.environment-explorer" })

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {"<EnvironmentExplorer>"} · {t("title")}
      </h2>
      <p className="mb-6 text-sm text-fg-muted">{t("description")}</p>
      <EnvironmentExplorer />
    </div>
  )
}
