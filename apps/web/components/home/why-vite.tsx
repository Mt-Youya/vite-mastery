import { getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/config"

interface WhyViteProps {
  locale: Locale
}

interface QuestionEntry {
  q: string
  a: string
}

export async function WhyVite({ locale }: WhyViteProps) {
  const t = await getTranslations({ locale, namespace: "home.whyVite" })
  /** next-intl 的 t() 也能取数组,这里 cast 出明确结构方便渲染。 */
  const questions = t.raw("questions") as QuestionEntry[]

  return (
    <section className="border-y border-border bg-bg-subtle/30">
      <div className="mx-auto grid max-w-doc gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:py-28">
        <header>
          <p className="text-xs font-medium tracking-wider text-fg-subtle uppercase">{t("eyebrow")}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-pretty text-fg-muted">{t("lead")}</p>
        </header>

        <ul className="divide-y divide-border text-base">
          {questions.map((entry) => (
            <li key={entry.q} className="grid gap-2 py-5 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto]">
              <p className="font-medium text-fg">{entry.q}</p>
              <p className="text-sm text-fg-muted md:text-right">{entry.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
