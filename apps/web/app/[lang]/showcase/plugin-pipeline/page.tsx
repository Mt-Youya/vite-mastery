import { getTranslations, setRequestLocale } from "next-intl/server"
import { PluginPipeline } from "@/components/interactive/plugin-pipeline"
import type { Locale } from "@/i18n/config"

interface PluginPipelineShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function PluginPipelineShowcase({ params }: PluginPipelineShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.plugin-pipeline" })

  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {"<PluginPipeline>"} · {t("title")}
      </h2>
      <p className="mb-6 text-sm text-fg-muted">{t("description")}</p>
      <PluginPipeline />

      <p className="mt-6 text-sm font-medium text-fg">{t("customTitle")}</p>
      <PluginPipeline
        plugins={[
          {
            name: "vite-plugin-checker",
            enforce: "pre",
            hooks: ["buildStart", "buildEnd"],
            description: t("checkerDescription"),
          },
          { name: "@vitejs/plugin-react", hooks: ["transform", "buildStart"], description: t("reactDescription") },
          {
            name: "vite-plugin-pwa",
            enforce: "post",
            hooks: ["generateBundle", "writeBundle"],
            description: t("pwaDescription"),
          },
        ]}
      />
    </div>
  )
}
