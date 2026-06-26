import { ArrowRight01Icon, GithubIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@vite-mastery/ui"
import Link from "next/link"
import { SITE } from "@/lib/site-config"

/**
 * Hero — 受 impeccable & taste-skill 约束:
 *   - max-w-5xl 容器,标题 2 行,副文 ≤ 20 字
 *   - 1 primary + 1 secondary CTA,无浮 badge / 浮统计
 *   - 居中编辑型版式,克制的 motion(纯 CSS,无 JS)
 */
export function Hero() {
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* 背景 ambient:克制的 radial,不用 mesh / purple */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--color-primary) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          搞懂 Vite 8,
          <span className="text-fg-muted">从 Rolldown 到 Environment API。</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[60ch] text-base leading-relaxed text-pretty text-fg-muted md:text-lg">
          一份系统化的中文指南,深挖 Rolldown 架构、Environment API 与 Hooks 时序。读完能写出生产级 Vite 8 插件。
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/docs">
            <Button variant="primary" size="lg">
              开始第一章
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={1.75} aria-hidden />
            </Button>
          </Link>
          <a href={SITE.repo} target="_blank" rel="noreferrer noopener">
            <Button variant="secondary" size="lg">
              <HugeiconsIcon icon={GithubIcon} className="size-4" strokeWidth={1.5} aria-hidden />
              在 GitHub 上查看
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
