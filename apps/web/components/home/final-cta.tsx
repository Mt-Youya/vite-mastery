import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@vite-mastery/ui"
import Link from "next/link"

/**
 * Final CTA —— 单一明确意图。文档 §0.2 禁 Hero-Metric Template,这里只放一个简短问题 + 一个 CTA。
 */
export function FinalCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24 md:py-32">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          准备好深入 Vite 了吗?
        </h2>
        <p className="max-w-prose text-base text-pretty text-fg-muted">
          从「为什么需要 Vite」开始,十二章一千多个段落,带你走完全链路。
        </p>
        <Link href="/docs/00-getting-started/01-why-vite">
          <Button variant="primary" size="lg">
            打开第一章
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={1.75} aria-hidden />
          </Button>
        </Link>
      </div>
    </section>
  )
}
