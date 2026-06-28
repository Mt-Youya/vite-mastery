import { getTranslations, setRequestLocale } from "next-intl/server"
import { HookExplorer } from "@/components/interactive/hook-explorer"
import type { Locale } from "@/i18n/config"

interface HookExplorerShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function HookExplorerShowcase({ params }: HookExplorerShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.hook-explorer" })

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {"<HookExplorer>"} · {t("title")}
      </h2>
      <p className="mb-6 text-sm text-fg-muted">{t("description")}</p>
      <HookExplorer />
      <p className="mt-4 text-sm text-fg-muted">{t("filterHint")}</p>
      <HookExplorer filter={["resolveId", "load", "transform"]} />
    </div>
  )
}
