import { EnvironmentExplorer } from "@/components/interactive/environment-explorer"

export default function EnvironmentExplorerShowcase() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">{"<EnvironmentExplorer>"} · 多环境模块边界</h2>
      <p className="mb-6 text-sm text-fg-muted">
        可视化展示 client / ssr / rsc 三个环境的模块图及边界隔离。点击模块查看它在哪些环境出现、importer 是谁。
      </p>
      <EnvironmentExplorer />
    </div>
  )
}
