import { getTranslations, setRequestLocale } from "next-intl/server"
import { DepGraph } from "@/components/interactive/dep-graph"
import type { Locale } from "@/i18n/config"

interface DepGraphShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function DepGraphShowcase({ params }: DepGraphShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.dep-graph" })

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {"<DepGraph>"} · {t("title")}
      </h2>
      <p className="mb-6 text-sm text-fg-muted">{t("description")}</p>
      <DepGraph />
    </div>
  )
}
