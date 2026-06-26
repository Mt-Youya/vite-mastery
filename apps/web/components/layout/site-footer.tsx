import Link from "next/link"
import { SITE } from "@/lib/site-config"

const FOOTER_LINKS = {
  内容: [
    { href: "/docs", label: "文档" },
    { href: "/examples", label: "实战项目" },
    { href: "/changelog", label: "变更日志" },
  ],
  资源: [
    { href: "https://vite.dev", label: "Vite 官方文档", external: true },
    { href: "https://rollupjs.org", label: "Rollup 文档", external: true },
    { href: SITE.repo, label: "GitHub 仓库", external: true },
  ],
  关于: [
    { href: "/about", label: "项目缘起" },
    { href: "/about#author", label: "作者" },
    { href: "/feedback", label: "反馈与勘误" },
  ],
}

export function SiteFooter() {
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
            <p className="mt-2 max-w-prose text-sm text-fg-muted">{SITE.description}</p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">{group}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-fg-muted transition-colors duration-base hover:text-fg"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-fg-muted transition-colors duration-base hover:text-fg">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.author.name}. 内容采用 CC BY-NC-SA 4.0,代码采用 MIT 许可证。
          </p>
          <p className="font-mono">v0.0 · 中文社区第一份 Vite 深度指南</p>
        </div>
      </div>
    </footer>
  )
}
