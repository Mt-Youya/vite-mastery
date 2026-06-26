import { HookExplorer } from "@/components/interactive/hook-explorer"

export default function HookExplorerShowcase() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">{"<HookExplorer>"} · Hook 时序查看器</h2>
      <p className="mb-6 text-sm text-fg-muted">
        点击左侧 hook 名称查看触发时机、参数签名、示例代码和 Rolldown 兼容性。
      </p>
      <HookExplorer />
      <p className="mt-4 text-sm text-fg-muted">使用 filter 限制显示特定 hook:</p>
      <HookExplorer filter={["resolveId", "load", "transform"]} />
    </div>
  )
}
