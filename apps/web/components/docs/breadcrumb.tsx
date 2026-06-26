import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null
  return (
    <nav aria-label="面包屑" className="text-xs text-fg-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors duration-base hover:text-fg">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-fg" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-3 text-fg-subtle"
                  strokeWidth={1.5}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
