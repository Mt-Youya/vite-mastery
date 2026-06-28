import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import Script from "next/script"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { THEME_STORAGE_KEY } from "@/components/layout/theme-constants"
import { Providers } from "./providers"
import { DEFAULT_LOCALE, LOCALES, LOCALE_HTML_TAG, OG_LOCALE, type Locale } from "@/i18n/config"
import { SITE } from "@/lib/site-config"
import "./styles/globals.css"

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(0.984 0.003 247.86)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.16 0.012 265)" },
  ],
}

const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("${THEME_STORAGE_KEY}") || "system";
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var theme = stored === "system" ? system : stored;
    if (theme !== "light" && theme !== "dark") theme = system;
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (_) {}
})();
`

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  if (!hasLocale(LOCALES, lang)) {
    notFound()
  }
  setRequestLocale(lang)
  const messages = await getMessages()
  return (
    <html
      lang={LOCALE_HTML_TAG[lang as Locale]}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <Script id="vite-mastery-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <Providers>
            <SiteHeader locale={lang as Locale} />
            <main className="flex-1">{children}</main>
            <SiteFooter locale={lang as Locale} />
          </Providers>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
