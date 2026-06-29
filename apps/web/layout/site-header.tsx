import { GithubIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { IconButton } from "@vite-mastery/ui"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Search } from "@/components/docs/search"
import { LangSwitcher } from "./lang-switcher"
import { MobileMenu } from "./mobile-menu"
import { ThemeToggle } from "./theme-toggle"
import type { Locale } from "@/i18n/config"
import { localizedHref } from "@/lib/i18n-routing"
import { NAV_LINKS, SITE } from "@/lib/site-config"

interface SiteHeaderProps {
  locale: Locale
}

export async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getTranslations({ locale, namespace: "nav" })
  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-doc items-center gap-4 px-4 sm:gap-8 sm:px-6">
        <div className="flex items-center gap-1 md:hidden">
          <MobileMenu locale={locale} />
        </div>

        <Link
          href={localizedHref("/", locale)}
          className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight"
        >
          <img
            src="/brand/vite-mastery-mark.svg"
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
            className="size-8 shrink-0 rounded-[9px] shadow-[0_10px_24px_rgb(15_23_42_/_0.18)] transition-transform duration-base group-hover:-translate-y-0.5"
          />
          <span>{SITE.name}</span>
        </Link>

        <nav aria-label={t("ariaPrimary")} className="hidden flex-1 items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={localizedHref(link.href, locale)}
              className="text-sm text-fg-muted transition-colors duration-base hover:text-fg"
            >
              {t(link.id)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-3">
          <div className="hidden md:block">
            <Search />
          </div>
          <div className="md:hidden">
            <Search compact />
          </div>
          <LangSwitcher />
          <a href={SITE.repo} target="_blank" rel="noreferrer noopener" className="inline-flex">
            <IconButton aria-label={t("github")} variant="ghost" size="sm">
              <HugeiconsIcon icon={GithubIcon} className="size-4" strokeWidth={1.5} aria-hidden />
            </IconButton>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
