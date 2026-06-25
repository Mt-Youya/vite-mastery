import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IconButton } from "@vite-mastery/ui";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/site-config";
import { Search } from "./docs/search";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-(--container-doc) items-center gap-8 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight"
        >
          <Logo />
          <span>{SITE.name}</span>
        </Link>

        <nav aria-label="主导航" className="hidden flex-1 items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-fg-muted transition-colors duration-base hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-3">
          <div className="hidden md:block">
            <Search />
          </div>
          <a href={SITE.repo} target="_blank" rel="noreferrer noopener">
            <IconButton aria-label="GitHub" variant="ghost" size="sm">
              <HugeiconsIcon
                icon={GithubIcon}
                className="size-4"
                strokeWidth={1.5}
                aria-hidden
              />
            </IconButton>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-primary"
    >
      <path
        d="M3.5 4.2 12 19.4l8.5-15.2-2.6 1.3L12 14.6 6.1 5.5 3.5 4.2Z"
        fill="currentColor"
        opacity=".85"
      />
    </svg>
  );
}
