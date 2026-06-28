"use client"

import { V7Note } from "@vite-mastery/mdx-components"
import { useLocale } from "next-intl"
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config"
import type { V7NoteProps } from "@vite-mastery/mdx-components"
import type { Locale } from "@/i18n/config"

const COPY: Record<Locale, { defaultTitle: string; expand: string; collapse: string }> = {
  en: {
    defaultTitle: "Vite 7 behavior difference",
    expand: "Expand",
    collapse: "Collapse",
  },
  zh: {
    defaultTitle: "Vite 7 行为差异",
    expand: "展开",
    collapse: "折叠",
  },
}

export function LocalizedV7Note({ title, expandLabel, collapseLabel, ...props }: V7NoteProps) {
  const current = useLocale()
  const locale = isLocale(current) ? current : DEFAULT_LOCALE
  const copy = COPY[locale]

  return (
    <V7Note
      {...props}
      title={title ?? copy.defaultTitle}
      expandLabel={expandLabel ?? copy.expand}
      collapseLabel={collapseLabel ?? copy.collapse}
    />
  )
}
