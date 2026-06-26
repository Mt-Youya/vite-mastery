import { DepGraph } from "@/components/interactive/dep-graph"

export default function DepGraphShowcase() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">{"<DepGraph>"} · Module Graph 可视化</h2>
      <p className="mb-6 text-sm text-fg-muted">
        @xyflow/react 渲染的交互式依赖图。拖拽、缩放均可用。点击节点查看 import / 被谁 import。
      </p>
      <DepGraph />
    </div>
  )
}
