import { getTranslations } from "next-intl/server"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { SITE } from "@/lib/site-config"

interface SiteFooterProps {
  locale: Locale
}

/** group-key → 该列的 link 配置。href 写成 /docs 等"裸"路径,渲染时拼 locale 前缀。 */
const FOOTER_GROUPS = [
  {
    groupKey: "content",
    links: [
      { key: "docs", href: "/docs" },
      { key: "examples", href: "/examples" },
      { key: "changelog", href: "/changelog" },
    ],
  },
  {
    groupKey: "resources",
    links: [
      { key: "viteDocs", external: "https://vite.dev" },
      { key: "rollupDocs", external: "https://rollupjs.org" },
      { key: "repo", external: SITE.repo },
    ],
  },
  {
    groupKey: "about",
    links: [
      { key: "origin", href: "/about" },
      { key: "author", href: "/about#author" },
      { key: "feedback", href: "/feedback" },
    ],
  },
] as const

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" })
  const tSite = await getTranslations({ locale, namespace: "site" })
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-24 border-t border-border bg-bg-subtle/40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-doc px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-sm font-semibold tracking-tight">{SITE.name}</p>
            <p className="mt-2 max-w-prose text-sm text-fg-muted">{tSite("description")}</p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.groupKey}>
              <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                {t(`groups.${group.groupKey}`)}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {group.links.map((link) =>
                  "external" in link ? (
                    <li key={link.key}>
                      <a
                        href={link.external}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-fg-muted transition-colors duration-base hover:text-fg"
                      >
                        {t(`links.${link.key}`)}
                      </a>
                    </li>
                  ) : (
                    <li key={link.key}>
                      <Link
                        href={localizedHref(link.href, locale)}
                        className="text-fg-muted transition-colors duration-base hover:text-fg"
                      >
                        {t(`links.${link.key}`)}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year: String(year), author: SITE.author.name })}</p>
          <p className="font-mono">v0.0 · {tSite("shortTagline")}</p>
        </div>
      </div>
    </footer>
  )
}
