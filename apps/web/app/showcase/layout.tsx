import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "组件展示 · vite-mastery",
  description: "交互式 MDX 组件 demo 页面",
}

const COMPONENTS = [
  { id: "v7-note", label: "V7Note", desc: "Vite 7 差异折叠块" },
  { id: "bundler-compare", label: "BundlerCompare", desc: "双引擎架构对比" },
  { id: "hook-explorer", label: "HookExplorer", desc: "Hook 时序查看器" },
  { id: "plugin-pipeline", label: "PluginPipeline", desc: "插件执行顺序可视化" },
  { id: "hmr-demo", label: "HmrDemo", desc: "HMR 协议演示" },
  { id: "environment-explorer", label: "EnvironmentExplorer", desc: "多环境模块边界" },
  { id: "config-playground", label: "ConfigPlayground", desc: "配置实验场" },
  { id: "dep-graph", label: "DepGraph", desc: "Module Graph 可视化" },
]

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">Showcase</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">交互式组件</h1>
        <p className="mt-2 text-sm text-fg-muted sm:text-base">阶段 5 全部 8 个 MDX 交互组件 demo。</p>
      </header>

      <nav className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/showcase"
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted hover:border-border-strong hover:text-fg transition-colors"
        >
          全部
        </Link>
        {COMPONENTS.map((c) => (
          <Link
            key={c.id}
            href={`/showcase/${c.id}`}
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-fg-muted hover:border-border-strong hover:text-fg transition-colors"
          >
            {c.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  )
}
