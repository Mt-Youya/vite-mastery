import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { HtmlLangSync } from "@/layout/html-lang-sync"
import { SiteFooter } from "@/layout/site-footer"
import { SiteHeader } from "@/layout/site-header"
import { Providers } from "./providers"
import { DEFAULT_LOCALE, LOCALES, LOCALE_HTML_TAG, OG_LOCALE, type Locale } from "@/i18n/config"
import { SITE } from "@/lib/site-config"

/**
 * locale 子 layout —— `<html>/<body>` 已经在真正的 root layout 里,
 * 这里只承担 i18n provider、主题 provider、header/footer 等"和 locale 强相关"的壳。
 *
 * 跨 `/zh` ↔ `/en` 切换时,只有这一层 + children 被替换,根文档不卸载,
 * 浏览器和 React 都能做软导航,白屏从此不再出现。
 */
interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(LOCALES, lang)) return {}
  const t = await getTranslations({ locale: lang, namespace: "site" })
  const title = t("title")
  const description = t("description")
  return {
    title: {
      default: title,
      template: `%s · ${SITE.name}`,
    },
    description,
    metadataBase: new URL(SITE.url),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang as Locale],
      siteName: SITE.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    authors: [{ name: SITE.author.name }],
    alternates: {
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [LOCALE_HTML_TAG[l], `/${l}`])),
        "x-default": `/${DEFAULT_LOCALE}`,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  if (!hasLocale(LOCALES, lang)) {
    notFound()
  }
  setRequestLocale(lang)
  const messages = await getMessages()
  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <Providers>
        <HtmlLangSync locale={lang as Locale} />
        <SiteHeader locale={lang as Locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={lang as Locale} />
      </Providers>
      <Analytics />
    </NextIntlClientProvider>
  )
}
