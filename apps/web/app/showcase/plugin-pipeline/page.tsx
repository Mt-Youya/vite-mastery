import { PluginPipeline } from "@/components/interactive/plugin-pipeline"

export default function PluginPipelineShowcase() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-2 font-display text-xl font-semibold">{"<PluginPipeline>"} · 插件执行顺序</h2>
      <p className="mb-6 text-sm text-fg-muted">悬停插件卡片,高亮共享同一 hook 的其他插件(橙色边框)。</p>
      <PluginPipeline />

      <p className="mt-6 text-sm font-medium text-fg">自定义插件列表:</p>
      <PluginPipeline
        plugins={[
          {
            name: "vite-plugin-checker",
            enforce: "pre",
            hooks: ["buildStart", "buildEnd"],
            description: "TypeScript 类型检查",
          },
          { name: "@vitejs/plugin-react", hooks: ["transform", "buildStart"], description: "React + Fast Refresh" },
          {
            name: "vite-plugin-pwa",
            enforce: "post",
            hooks: ["generateBundle", "writeBundle"],
            description: "PWA service worker 注入",
          },
        ]}
      />
    </div>
  )
}
