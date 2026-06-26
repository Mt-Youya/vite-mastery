"use client"

/**
 * <HookExplorer> —— Vite / Rolldown hooks 时序图查看器。
 *
 * 点击 hook 展示:触发时机 / 参数签名 / 典型场景 / 示例代码 / Rolldown 兼容性。
 */

import { useState } from "react"
import { cn } from "@/lib/utils"

type Compat = "rollup-compat" | "vite-only" | "rolldown-extended"

interface Hook {
  name: string
  phase: "config" | "server" | "build" | "output"
  trigger: string
  signature: string
  compat: Compat
  description: string
  example: string
}

const HOOKS: Hook[] = [
  {
    name: "config",
    phase: "config",
    trigger: "读取配置文件之前",
    signature: "(config: UserConfig, env: ConfigEnv) => UserConfig | null | void",
    compat: "vite-only",
    description: "修改或替换 Vite 配置。返回值与已有配置 deep merge。",
    example: `config(config, { command }) {
  if (command === "build") {
    return { base: "/prod/" }
  }
}`,
  },
  {
    name: "configResolved",
    phase: "config",
    trigger: "配置解析完毕",
    signature: "(config: ResolvedConfig) => void",
    compat: "vite-only",
    description: "读取最终解析配置,常用于缓存引用。此时不可再修改配置。",
    example: `let viteConfig: ResolvedConfig

configResolved(config) {
  viteConfig = config
}`,
  },
  {
    name: "configureServer",
    phase: "server",
    trigger: "dev server 创建完毕",
    signature: "(server: ViteDevServer) => (() => void) | void",
    compat: "vite-only",
    description: "访问并扩展 dev server 实例。返回函数会在内置中间件之前执行。",
    example: `configureServer(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url === "/__ping") {
      res.end("pong")
    } else {
      next()
    }
  })
}`,
  },
  {
    name: "transformIndexHtml",
    phase: "server",
    trigger: "处理 index.html 时",
    signature: "(html: string, ctx: TransformIndexHtmlContext) => IndexHtmlTransformResult",
    compat: "vite-only",
    description: "直接操作 HTML 字符串,可注入 script/link/meta 或修改内容。",
    example: `transformIndexHtml(html) {
  return html.replace(
    /<title>(.*?)<\/title>/,
    \`<title>My App</title>\`
  )
}`,
  },
  {
    name: "buildStart",
    phase: "build",
    trigger: "构建开始前",
    signature: "(options: InputOptions) => void",
    compat: "rollup-compat",
    description: "在每次构建开始时触发。适合初始化状态或清理缓存。",
    example: `buildStart() {
  console.log("Build started at", Date.now())
  this.cache.clear()
}`,
  },
  {
    name: "resolveId",
    phase: "build",
    trigger: "解析模块 ID",
    signature: "(source: string, importer?: string) => string | null | false | { id: string }",
    compat: "rollup-compat",
    description: "拦截模块 ID 解析。虚拟模块(\\0前缀)的核心钩子。返回 null 跳过,false 标记为 external。",
    example: `const VIRTUAL_ID = "virtual:my-module"
const RESOLVED_ID = "\\0" + VIRTUAL_ID

resolveId(id) {
  if (id === VIRTUAL_ID) return RESOLVED_ID
  return null
}`,
  },
  {
    name: "load",
    phase: "build",
    trigger: "加载模块内容",
    signature: "(id: string) => string | null | { code: string; map?: SourceMap }",
    compat: "rollup-compat",
    description: "自定义模块内容。与 resolveId 配合实现虚拟模块。返回 null 跳过(由文件系统加载)。",
    example: `load(id) {
  if (id === RESOLVED_ID) {
    return \`export const version = "8.1.0"\`
  }
  return null
}`,
  },
  {
    name: "transform",
    phase: "build",
    trigger: "每个模块加载后",
    signature: "(code: string, id: string) => TransformResult",
    compat: "rollup-compat",
    description: "转换模块源代码。最常用的钩子:编译、注入、替换均在此处理。",
    example: `transform(code, id) {
  if (!id.endsWith(".vue")) return null
  const result = compileVue(code)
  return {
    code: result.js,
    map: result.map,
  }
}`,
  },
  {
    name: "buildEnd",
    phase: "build",
    trigger: "构建结束/出错时",
    signature: "(error?: Error) => void",
    compat: "rollup-compat",
    description: "构建完成后的清理钩子。无论成功还是出错都会执行。",
    example: `buildEnd(error) {
  if (error) {
    console.error("Build failed:", error.message)
  }
  this.cache.clear()
}`,
  },
  {
    name: "generateBundle",
    phase: "output",
    trigger: "chunk 生成完毕",
    signature: "(options: OutputOptions, bundle: OutputBundle, isWrite: boolean) => void",
    compat: "rollup-compat",
    description: "可读取/修改最终产物 bundle 对象。此时 isWrite 区分 generate 与 write。",
    example: `generateBundle(_, bundle) {
  for (const [fileName, chunk] of Object.entries(bundle)) {
    if (chunk.type === "chunk") {
      this.emitFile({
        type: "asset",
        fileName: "stats.json",
        source: JSON.stringify({ size: chunk.code.length }),
      })
    }
  }
}`,
  },
  {
    name: "renderChunk",
    phase: "output",
    trigger: "每个 chunk 渲染时",
    signature:
      "(code: string, chunk: RenderedChunk, options: OutputOptions) => { code: string; map?: SourceMap } | null",
    compat: "rolldown-extended",
    description: "对每个输出 chunk 进行代码转换。Rolldown 在此钩子上扩展了 envName 等字段。",
    example: `renderChunk(code, chunk) {
  if (chunk.type === "chunk" && chunk.isEntry) {
    return {
      code: \`/* bundle version 8.1 */\n\` + code,
    }
  }
  return null
}`,
  },
]

const PHASES: { key: Hook["phase"]; label: string; color: string }[] = [
  { key: "config", label: "配置阶段", color: "text-blue-500" },
  { key: "server", label: "Dev Server", color: "text-green-500" },
  { key: "build", label: "构建阶段", color: "text-brand-500" },
  { key: "output", label: "输出阶段", color: "text-purple-500" },
]

const COMPAT_LABELS: Record<Compat, { label: string; className: string }> = {
  "rollup-compat": {
    label: "Rollup 兼容",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "vite-only": {
    label: "Vite 独有",
    className: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
  },
  "rolldown-extended": {
    label: "Rolldown 扩展",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
}

export interface HookExplorerProps {
  /** 只展示指定 hook,默认全展示 */
  filter?: string[]
}

export function HookExplorer({ filter }: HookExplorerProps) {
  const [active, setActive] = useState<string | null>(null)
  const [phaseFilter, setPhaseFilter] = useState<Hook["phase"] | "all">("all")

  const visibleHooks = HOOKS.filter((h) => !filter || filter.includes(h.name)).filter(
    (h) => phaseFilter === "all" || h.phase === phaseFilter
  )

  const activeHook = visibleHooks.find((h) => h.name === active) ?? null

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle mr-2">Hook 时序浏览器</span>
        {/* 阶段过滤 */}
        <button
          onClick={() => setPhaseFilter("all")}
          className={cn(
            "rounded-md px-2 py-0.5 text-xs transition-colors",
            phaseFilter === "all" ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
          )}
        >
          全部
        </button>
        {PHASES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPhaseFilter(phaseFilter === p.key ? "all" : p.key)}
            className={cn(
              "rounded-md px-2 py-0.5 text-xs transition-colors",
              phaseFilter === p.key ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
            )}
          >
            {p.label}
          </button>
        ))}
      </figcaption>

      <div className="flex flex-col md:flex-row">
        {/* 左:hook 列表 */}
        <div className="w-full overflow-y-auto border-b border-border md:w-56 md:border-b-0 md:border-r">
          <ul>
            {visibleHooks.map((hook, i) => {
              const phase = PHASES.find((p) => p.key === hook.phase)
              const isActive = active === hook.name
              return (
                <li key={hook.name}>
                  <button
                    onClick={() => setActive(isActive ? null : hook.name)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm",
                      "transition-colors duration-[--duration-fast]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400/50",
                      isActive
                        ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                        : "text-fg hover:bg-bg-muted",
                      i > 0 && "border-t border-border/50"
                    )}
                    aria-pressed={isActive}
                  >
                    {/* 阶段色条 */}
                    <span className={cn("h-3 w-0.5 rounded-full shrink-0", phase?.color.replace("text-", "bg-"))} />
                    <span className="font-mono">{hook.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 右:详情面板 */}
        <div className="flex-1 min-h-[280px] p-5">
          {activeHook ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start gap-2">
                <h3 className="font-mono text-lg font-bold text-fg">{activeHook.name}</h3>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-2xs font-medium",
                    COMPAT_LABELS[activeHook.compat].className
                  )}
                >
                  {COMPAT_LABELS[activeHook.compat].label}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">触发时机</p>
                <p className="text-sm text-fg">{activeHook.trigger}</p>
              </div>

              <div className="space-y-1">
                <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">说明</p>
                <p className="text-sm leading-relaxed text-fg-muted">{activeHook.description}</p>
              </div>

              <div className="space-y-1">
                <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">参数签名</p>
                <pre className="overflow-x-auto rounded-md bg-bg-muted px-3 py-2 font-mono text-2xs text-fg">
                  {activeHook.signature}
                </pre>
              </div>

              <div className="space-y-1">
                <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">示例代码</p>
                <pre className="overflow-x-auto rounded-md bg-bg-muted px-3 py-2.5 font-mono text-xs text-fg leading-relaxed">
                  {activeHook.example}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-subtle">
              <svg
                className="h-8 w-8 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">点击左侧 hook 查看详情</p>
            </div>
          )}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-3 border-t border-border px-5 py-2.5">
        {Object.entries(COMPAT_LABELS).map(([key, val]) => (
          <span key={key} className="flex items-center gap-1.5 text-2xs text-fg-subtle">
            <span
              className={cn(
                "h-1.5 w-3 rounded-full",
                val.className.split(" ").find((c) => c.startsWith("bg-"))
              )}
            />
            {val.label}
          </span>
        ))}
      </div>
    </figure>
  )
}
