import { ConfigPlayground } from "@/components/interactive/config-playground"

export default function ConfigPlaygroundShowcase() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">{"<ConfigPlayground>"} · 配置实验场</h2>
      <p className="mb-6 text-sm text-fg-muted">
        编辑左侧 vite.config.ts,右侧实时推导产物结构变化。试试修改 outDir、assetsDir、sourcemap、manualChunks 字段。
      </p>
      <ConfigPlayground />
    </div>
  )
}
