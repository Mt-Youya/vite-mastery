import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Playground · vite-mastery",
  description: "在浏览器里直接运行 Vite 8 插件实验——基于 WebContainer，无需本地安装任何环境。",
}

const FEATURES = [
  { icon: "⚡", title: "零配置启动", desc: "浏览器内完整 Node.js 环境，打开即用" },
  { icon: "🔌", title: "插件实验场", desc: "实时修改 vite.config.ts 和插件代码，即时看到效果" },
  { icon: "📦", title: "真实 pnpm install", desc: "WebContainer 跑真正的 pnpm，不是 Mock" },
  { icon: "🔄", title: "HMR 全程在线", desc: "编辑源文件，预览窗口实时热更新" },
]

export default function PlaygroundPage() {
  const isDev = process.env.NODE_ENV === "development"

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      {/* 头部 */}
      <header className="text-center">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">在线实验场</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Playground
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          基于 WebContainer——在浏览器里跑真实的 Vite 8 dev server，边改边看，无需本地安装任何东西。
        </p>

        {/* 启动按钮 */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={SITE.playgroundUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90"
          >
            <span>打开 Playground</span>
            <span aria-hidden>↗</span>
          </a>
          <Link
            href="/docs/03-plugin-system/04-virtual-modules-plugin"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-6 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            配套教程
          </Link>
        </div>

        {/* dev 模式提示 */}
        {isDev && (
          <p className="mt-4 text-xs text-fg-subtle">
            Dev 模式：需先运行{" "}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono">pnpm --filter @vite-mastery/playground dev</code>
            {" "}启动 Playground（:5173）
          </p>
        )}
      </header>

      {/* 特性卡片 */}
      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-bg-elevated p-5"
          >
            <div className="text-2xl">{f.icon}</div>
            <h2 className="mt-3 font-display text-base font-semibold text-fg">{f.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* 说明 */}
      <div className="mt-12 rounded-xl border border-dashed border-border bg-bg-subtle/50 px-6 py-8 text-center text-sm text-fg-muted">
        <p>
          Playground 是独立部署的 Vite 应用，源码在仓库{" "}
          <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">apps/playground/</code>。
        </p>
        <a
          href={`${SITE.repo}/tree/main/apps/playground`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-2 inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
        >
          查看源码 →
        </a>
      </div>
    </div>
  )
}
