"use client"

/**
 * <HookExplorer> —— Vite / Rolldown hooks 时序图查看器。
 *
 * 点击 hook 展示:触发时机 / 参数签名 / 典型场景 / 示例代码 / Rolldown 兼容性。
 */

import { useState } from "react"
import type { Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"
import { useInteractiveLocale } from "./locale"

type Compat = "rollup-compat" | "vite-only" | "rolldown-extended"

interface Hook {
  name: string
  phase: "config" | "server" | "build" | "output"
  trigger: Record<Locale, string>
  signature: string
  compat: Compat
  description: Record<Locale, string>
  example: string
}

const HOOKS: Hook[] = [
  {
    name: "config",
    phase: "config",
    trigger: { en: "Before the config file is read", zh: "读取配置文件之前" },
    signature: "(config: UserConfig, env: ConfigEnv) => UserConfig | null | void",
    compat: "vite-only",
    description: {
      en: "Modify or replace the Vite config. Returned values are deeply merged with the existing config.",
      zh: "修改或替换 Vite 配置。返回值与已有配置 deep merge。",
    },
    example: `config(config, { command }) {
  if (command === "build") {
    return { base: "/prod/" }
  }
}`,
  },
  {
    name: "configResolved",
    phase: "config",
    trigger: { en: "After config resolution", zh: "配置解析完毕" },
    signature: "(config: ResolvedConfig) => void",
    compat: "vite-only",
    description: {
      en: "Read the final resolved config, often to cache references. The config should not be mutated here.",
      zh: "读取最终解析配置,常用于缓存引用。此时不可再修改配置。",
    },
    example: `let viteConfig: ResolvedConfig

configResolved(config) {
  viteConfig = config
}`,
  },
  {
    name: "configureServer",
    phase: "server",
    trigger: { en: "After the dev server is created", zh: "dev server 创建完毕" },
    signature: "(server: ViteDevServer) => (() => void) | void",
    compat: "vite-only",
    description: {
      en: "Access and extend the dev server instance. A returned function runs before built-in middleware.",
      zh: "访问并扩展 dev server 实例。返回函数会在内置中间件之前执行。",
    },
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
    trigger: { en: "When index.html is transformed", zh: "处理 index.html 时" },
    signature: "(html: string, ctx: TransformIndexHtmlContext) => IndexHtmlTransformResult",
    compat: "vite-only",
    description: {
      en: "Operate on the HTML string directly. You can inject script/link/meta tags or rewrite content.",
      zh: "直接操作 HTML 字符串,可注入 script/link/meta 或修改内容。",
    },
    example: `transformIndexHtml(html) {
  return html.replace(
    /<title>(.*?)<\\/title>/,
    \`<title>My App</title>\`
  )
}`,
  },
  {
    name: "buildStart",
    phase: "build",
    trigger: { en: "Before build starts", zh: "构建开始前" },
    signature: "(options: InputOptions) => void",
    compat: "rollup-compat",
    description: {
      en: "Runs at the start of each build. Good for initializing state or clearing caches.",
      zh: "在每次构建开始时触发。适合初始化状态或清理缓存。",
    },
    example: `buildStart() {
  console.log("Build started at", Date.now())
  this.cache.clear()
}`,
  },
  {
    name: "resolveId",
    phase: "build",
    trigger: { en: "Resolve module IDs", zh: "解析模块 ID" },
    signature: "(source: string, importer?: string) => string | null | false | { id: string }",
    compat: "rollup-compat",
    description: {
      en: "Intercept module ID resolution. This is the core hook for virtual modules with the \\0 prefix. Return null to skip or false to mark as external.",
      zh: "拦截模块 ID 解析。虚拟模块(\\0前缀)的核心钩子。返回 null 跳过,false 标记为 external。",
    },
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
    trigger: { en: "Load module content", zh: "加载模块内容" },
    signature: "(id: string) => string | null | { code: string; map?: SourceMap }",
    compat: "rollup-compat",
    description: {
      en: "Provide custom module content. Paired with resolveId for virtual modules. Return null to let the file system load it.",
      zh: "自定义模块内容。与 resolveId 配合实现虚拟模块。返回 null 跳过(由文件系统加载)。",
    },
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
    trigger: { en: "After each module is loaded", zh: "每个模块加载后" },
    signature: "(code: string, id: string) => TransformResult",
    compat: "rollup-compat",
    description: {
      en: "Transform module source code. This is the most common hook for compiling, injecting or replacing code.",
      zh: "转换模块源代码。最常用的钩子:编译、注入、替换均在此处理。",
    },
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
    trigger: { en: "When build finishes or fails", zh: "构建结束/出错时" },
    signature: "(error?: Error) => void",
    compat: "rollup-compat",
    description: {
      en: "Cleanup hook after build completion. It runs whether the build succeeds or fails.",
      zh: "构建完成后的清理钩子。无论成功还是出错都会执行。",
    },
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
    trigger: { en: "After chunks are generated", zh: "chunk 生成完毕" },
    signature: "(options: OutputOptions, bundle: OutputBundle, isWrite: boolean) => void",
    compat: "rollup-compat",
    description: {
      en: "Read or mutate the final bundle object. isWrite distinguishes generate from write.",
      zh: "可读取/修改最终产物 bundle 对象。此时 isWrite 区分 generate 与 write。",
    },
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
    trigger: { en: "When each chunk is rendered", zh: "每个 chunk 渲染时" },
    signature:
      "(code: string, chunk: RenderedChunk, options: OutputOptions) => { code: string; map?: SourceMap } | null",
    compat: "rolldown-extended",
    description: {
      en: "Transform each output chunk. Rolldown extends this hook with fields such as envName.",
      zh: "对每个输出 chunk 进行代码转换。Rolldown 在此钩子上扩展了 envName 等字段。",
    },
    example: `renderChunk(code, chunk) {
  if (chunk.type === "chunk" && chunk.isEntry) {
    return {
      code: \`/* bundle version 8.1 */\\n\` + code,
    }
  }
  return null
}`,
  },
]

const PHASES: { key: Hook["phase"]; label: Record<Locale, string>; color: string }[] = [
  { key: "config", label: { en: "Config", zh: "配置阶段" }, color: "text-blue-500" },
  { key: "server", label: { en: "Dev Server", zh: "Dev Server" }, color: "text-green-500" },
  { key: "build", label: { en: "Build", zh: "构建阶段" }, color: "text-brand-500" },
  { key: "output", label: { en: "Output", zh: "输出阶段" }, color: "text-purple-500" },
]

const COMPAT_LABELS: Record<Compat, { label: Record<Locale, string>; className: string }> = {
  "rollup-compat": {
    label: { en: "Rollup-compatible", zh: "Rollup 兼容" },
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "vite-only": {
    label: { en: "Vite-only", zh: "Vite 独有" },
    className: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
  },
  "rolldown-extended": {
    label: { en: "Rolldown extension", zh: "Rolldown 扩展" },
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
}

const COPY = {
  en: {
    caption: "Hook timing browser",
    all: "All",
    trigger: "Trigger",
    description: "Description",
    signature: "Signature",
    example: "Example",
    empty: "Click a hook on the left to inspect details",
  },
  zh: {
    caption: "Hook 时序浏览器",
    all: "全部",
    trigger: "触发时机",
    description: "说明",
    signature: "参数签名",
    example: "示例代码",
    empty: "点击左侧 hook 查看详情",
  },
} as const

export interface HookExplorerProps {
  /** 只展示指定 hook,默认全展示 */
  filter?: string[]
}

export function HookExplorer({ filter }: HookExplorerProps) {
  const locale = useInteractiveLocale()
  const copy = COPY[locale]
  const [active, setActive] = useState<string | null>(null)
  const [phaseFilter, setPhaseFilter] = useState<Hook["phase"] | "all">("all")

  const visibleHooks = HOOKS.filter((h) => !filter || filter.includes(h.name)).filter(
    (h) => phaseFilter === "all" || h.phase === phaseFilter
  )

  const activeHook = visibleHooks.find((h) => h.name === active) ?? null

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle mr-2">{copy.caption}</span>
        {/* 阶段过滤 */}
        <button
          onClick={() => setPhaseFilter("all")}
          className={cn(
            "rounded-md px-2 py-0.5 text-xs transition-colors",
            phaseFilter === "all" ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
          )}
        >
          {copy.all}
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
            {p.label[locale]}
          </button>
        ))}
      </figcaption>

      <div className="flex flex-col md:flex-row">
        {/* 左:hook 列表 */}
        <div className="w-full overflow-y-auto border-b border-border md:w-60 md:min-w-56 md:border-b-0 md:border-r">
          <ul>
            {visibleHooks.map((hook, i) => {
              const phase = PHASES.find((p) => p.key === hook.phase)
              const isActive = active === hook.name
              return (
                <li key={hook.name}>
                  <button
                    onClick={() => setActive(isActive ? null : hook.name)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                      "transition-colors duration-[--duration-fast]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400/50",
                      isActive
                        ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                        : "text-fg hover:bg-bg-muted",
                      i > 0 && "border-t border-border/50"
                    )}
                    aria-pressed={isActive}
                  >
                    <span className={cn("h-3 w-0.5 rounded-full shrink-0", phase?.color.replace("text-", "bg-"))} />
                    <span className="truncate font-mono">{hook.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 右:详情面板 —— 限宽避免在宽列下被拉成大字报 */}
        <div className="min-h-50 flex-1 p-4">
          <div className="max-w-2xl">
            {activeHook ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-mono text-base font-bold text-fg">{activeHook.name}</h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-2xs font-medium",
                      COMPAT_LABELS[activeHook.compat].className
                    )}
                  >
                    {COMPAT_LABELS[activeHook.compat].label[locale]}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">{copy.trigger}</p>
                  <p className="text-sm text-fg">{activeHook.trigger[locale]}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">{copy.description}</p>
                  <p className="text-sm leading-relaxed text-fg-muted">{activeHook.description[locale]}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">{copy.signature}</p>
                  <pre className="whitespace-pre-wrap wrap-break-word rounded-md bg-bg-muted px-3 py-2 font-mono text-2xs text-fg">
                    {activeHook.signature}
                  </pre>
                </div>

                <div className="space-y-1">
                  <p className="text-2xs font-medium uppercase tracking-wider text-fg-subtle">{copy.example}</p>
                  <pre className="overflow-x-auto rounded-md bg-bg-muted px-3 py-2.5 font-mono text-xs leading-relaxed text-fg">
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
                <p className="text-sm">{copy.empty}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </figure>
  )
}
