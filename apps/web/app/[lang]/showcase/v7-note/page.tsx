import { getTranslations, setRequestLocale } from "next-intl/server"
import { LocalizedV7Note as V7Note } from "@/components/mdx/localized-v7-note"
import type { Locale } from "@/i18n/config"

interface V7NoteShowcaseProps {
  params: Promise<{ lang: Locale }>
}

export default async function V7NoteShowcase({ params }: V7NoteShowcaseProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const t = await getTranslations({ locale: lang, namespace: "showcase.demos.v7-note" })
  const firstItems = t.raw("firstItems") as string[]

  return (
    <div className="max-w-2xl">
      <h2 className="mb-6 font-display text-xl font-semibold">
        {"<V7Note>"} · {t("title")}
      </h2>

      <V7Note title={t("firstTitle")}>
        <p className="mb-3">
          {t("firstIntroBefore")}
          <code>esbuild</code>
          {t("firstIntroMiddle")}
          <code>Rollup</code>
          {t("firstIntroAfter")}
        </p>
        <ul className="list-disc space-y-1 pl-4">
          {firstItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-fg-subtle text-sm">{t("firstMigration")}</p>
      </V7Note>

      <V7Note title={t("secondTitle")}>
        <p>
          {t("secondBefore")}
          <code>{t("secondCode")}</code>
          {t("secondAfter")}
        </p>
        <p className="mt-2 text-fg-subtle text-sm">{t("secondMigration")}</p>
      </V7Note>

      <V7Note title={t("defaultTitle")}>{t("defaultBody")}</V7Note>
    </div>
  )
}
