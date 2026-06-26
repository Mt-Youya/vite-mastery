import { HmrDemo } from "@/components/interactive/hmr-demo"

export default function HmrDemoShowcase() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">{"<HmrDemo>"} · HMR 协议演示</h2>
      <p className="mb-6 text-sm text-fg-muted">
        在左侧编辑器中修改任意代码,右侧实时展示 Vite HMR WebSocket 报文结构(模拟)。
      </p>
      <HmrDemo />
    </div>
  )
}
