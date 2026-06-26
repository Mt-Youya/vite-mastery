import { BundlerCompare } from "@/components/interactive/bundler-compare"

export default function BundlerCompareShowcase() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">{"<BundlerCompare>"} · 双引擎架构对比</h2>
      <p className="mb-6 text-sm text-fg-muted">
        点击或悬停节点高亮数据流。左:Vite 7 esbuild+Rollup 双引擎;右:Vite 8 Rolldown 统一引擎。
      </p>
      <BundlerCompare />
    </div>
  )
}
