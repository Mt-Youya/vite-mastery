import Link from "next/link"

const COMPONENTS = [
  { id: "v7-note", label: "V7Note", desc: "Vite 7 差异折叠块,用于在正文中标注与 Vite 8 的行为差异。" },
  {
    id: "bundler-compare",
    label: "BundlerCompare",
    desc: "Vite 7 双引擎(esbuild+Rollup)vs Vite 8 Rolldown 架构对比图。",
  },
  { id: "hook-explorer", label: "HookExplorer", desc: "Vite/Rolldown hooks 时序图查看器,点击展示签名与示例。" },
  {
    id: "plugin-pipeline",
    label: "PluginPipeline",
    desc: "插件执行顺序可视化,按 pre/normal/post 分组展示 hook 关系。",
  },
  { id: "hmr-demo", label: "HmrDemo", desc: "HMR 协议演示器,CodeMirror 编辑触发模拟 WebSocket 消息流。" },
  {
    id: "environment-explorer",
    label: "EnvironmentExplorer",
    desc: "Environment API 多环境隔离可视化,展示 client/ssr/rsc 模块边界。",
  },
  { id: "config-playground", label: "ConfigPlayground", desc: "vite.config.ts 交互式编辑器,实时推导产物结构。" },
  { id: "dep-graph", label: "DepGraph", desc: "Module Graph 可视化,点击节点查看 import/importer 关系。" },
]

export default function ShowcasePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COMPONENTS.map((c) => (
        <Link
          key={c.id}
          href={`/showcase/${c.id}`}
          className="group flex flex-col gap-2 rounded-xl border border-border bg-bg-elevated p-5 transition-colors hover:border-border-strong hover:bg-bg-muted/30"
        >
          <p className="font-mono text-sm font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {"<"}
            {c.label}
            {" />"}
          </p>
          <p className="text-sm text-fg-muted leading-relaxed">{c.desc}</p>
        </Link>
      ))}
    </div>
  )
}
