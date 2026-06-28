import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { PARTS } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface PartsOverviewProps {
  locale: Locale
}

/**
 * Parts Overview —— 14 章节地图。
 *
 * 反 identical-card-grids:不用 14 个等大 icon-card,改用编辑型 list,
 * 五个主轴章节(spotlight)用更大字号区分。难度用 `▮` 符号表达,不用色彩。
 */
export async function PartsOverview({ locale }: PartsOverviewProps) {
  const t = await getTranslations({ locale, namespace: "home.partsOverview" })
  const tParts = await getTranslations({ locale, namespace: "parts" })

  return (
    <section className="mx-auto max-w-doc px-4 py-16 sm:px-6 sm:py-24 md:py-28">
      <header className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">{t("title")}</h2>
        <p className="mt-4 text-sm leading-relaxed text-pretty text-fg-muted md:text-base">{t("lead")}</p>
      </header>

      <ol className="mt-12 divide-y divide-border border-y border-border">
        {PARTS.map((part) => {
          const isSpotlight = "spotlight" in part && part.spotlight
          return (
            <li key={part.id}>
              <Link
                href={localizedHref(`/docs/${part.id}`, locale)}
                className={cn(
                  "group grid items-baseline gap-4 px-1 py-6",
                  "md:grid-cols-[5rem_1fr_auto] md:gap-8 md:py-7",
                  "transition-colors duration-base hover:bg-bg-subtle/40"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs tracking-wider text-fg-subtle tabular-nums",
                    isSpotlight && "text-primary"
                  )}
                >
                  {t("partLabel")} {part.no}
                </span>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-display font-semibold tracking-tight text-fg",
                      isSpotlight ? "text-xl md:text-2xl" : "text-base md:text-lg"
                    )}
                  >
                    {tParts(`${part.id}.title`)}
                    {isSpotlight ? (
                      <span className="ml-3 align-middle font-mono text-[10px] font-normal tracking-widest text-primary uppercase">
                        {t("spotlightTag")}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-pretty text-fg-muted">{tParts(`${part.id}.summary`)}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-fg-subtle tabular-nums md:gap-6">
                  <span>{t("chapterCount", { count: part.chapters })}</span>
                  <Difficulty level={part.difficulty} ariaLabel={t("difficultyAria", { level: part.difficulty })} />
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4 transition-transform duration-base group-hover:translate-x-1"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Difficulty({ level, ariaLabel }: { level: number; ariaLabel: string }) {
  return (
    <span aria-label={ariaLabel} className="font-mono tracking-tight">
      {"▮".repeat(level)}
      <span className="text-border-strong">{"▯".repeat(4 - level)}</span>
    </span>
  )
}
