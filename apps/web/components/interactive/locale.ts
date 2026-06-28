"use client"

import { useLocale } from "next-intl"
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config"

export function useInteractiveLocale(): Locale {
  const locale = useLocale()
  return isLocale(locale) ? locale : DEFAULT_LOCALE
}
