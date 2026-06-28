import { allDocs } from "content-collections"
import { setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { AnchorScroller } from "@/components/docs/anchor-scroller"
import { MobileSidebar } from "@/components/docs/mobile-sidebar"
import { Sidebar } from "@/components/docs/sidebar"
import type { Locale } from "@/i18n/config"
import { buildDocsTree, pickDocsForLocale, type DocItem } from "@/lib/docs-tree"

interface DocsLayoutProps {
  children: ReactNode
  params: Promise<{ lang: Locale }>
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  const { lang } = await params
  setRequestLocale(lang)
  const docs = pickDocsForLocale(allDocs as unknown as DocItem[], lang)
  const tree = buildDocsTree(docs)

  return (
    <div className="mx-auto grid max-w-doc gap-8 px-4 py-6 sm:px-6 sm:py-10 md:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      <AnchorScroller />
      <aside className="hidden md:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2">
          <Sidebar tree={tree} locale={lang} />
        </div>
      </aside>
      <div className="min-w-0">
        <MobileSidebar tree={tree} locale={lang} />
        {children}
      </div>
    </div>
  )
}
