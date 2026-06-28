"use client"

/**
 * <PluginPipeline> —— 插件执行顺序可视化。
 *
 * 接收一组插件配置(name / enforce / hooks),渲染三列流程图:
 *   pre → normal → post
 * hover 某个插件,高亮它所覆盖的 hook。
 */

import { useState } from "react"
import type { Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"
import { useInteractiveLocale } from "./locale"

export interface PluginDef {
  name: string
  enforce?: "pre" | "post"
  hooks: string[]
  description?: string
}

const DEFAULT_PLUGINS: Record<Locale, PluginDef[]> = {
  en: [
    {
      name: "vite:html-transform",
      enforce: "pre",
      hooks: ["transformIndexHtml", "resolveId"],
      description: "Handle asset references in index.html",
    },
    {
      name: "my-virtual-plugin",
      enforce: "pre",
      hooks: ["resolveId", "load"],
      description: "Generate a virtual module (\\0virtual:...)",
    },
    {
      name: "vite:resolve",
      hooks: ["resolveId"],
      description: "Path resolution and alias handling",
    },
    {
      name: "@vitejs/plugin-react",
      hooks: ["transform", "buildStart"],
      description: "JSX transform + Fast Refresh",
    },
    {
      name: "vite:css",
      hooks: ["load", "transform"],
      description: "CSS Modules / PostCSS / CSS in JS",
    },
    {
      name: "vite-plugin-legacy",
      enforce: "post",
      hooks: ["generateBundle", "renderChunk"],
      description: "Generate polyfills for legacy browsers",
    },
  ],
  zh: [
    {
      name: "vite:html-transform",
      enforce: "pre",
      hooks: ["transformIndexHtml", "resolveId"],
      description: "处理 index.html 中的资源引用",
    },
    {
      name: "my-virtual-plugin",
      enforce: "pre",
      hooks: ["resolveId", "load"],
      description: "生成虚拟模块(\\0virtual:...)",
    },
    {
      name: "vite:resolve",
      hooks: ["resolveId"],
      description: "路径解析与别名处理",
    },
    {
      name: "@vitejs/plugin-react",
      hooks: ["transform", "buildStart"],
      description: "JSX transform + Fast Refresh",
    },
    {
      name: "vite:css",
      hooks: ["load", "transform"],
      description: "CSS Modules / PostCSS / CSS in JS",
    },
    {
      name: "vite-plugin-legacy",
      enforce: "post",
      hooks: ["generateBundle", "renderChunk"],
      description: "生成兼容旧浏览器的 polyfill 产物",
    },
  ],
}

interface Column {
  key: "pre" | "normal" | "post"
  label: string
  desc: Record<Locale, string>
  color: string
}

const COLUMNS: Column[] = [
  {
    key: "pre",
    label: "pre",
    desc: { en: 'enforce: "pre"', zh: 'enforce: "pre"' },
    color: "border-blue-400/60 bg-blue-50/30 dark:bg-blue-900/10",
  },
  {
    key: "normal",
    label: "normal",
    desc: { en: "no enforce", zh: "无 enforce" },
    color: "border-brand-400/60 bg-brand-50/30 dark:bg-brand-900/10",
  },
  {
    key: "post",
    label: "post",
    desc: { en: 'enforce: "post"', zh: 'enforce: "post"' },
    color: "border-purple-400/60 bg-purple-50/30 dark:bg-purple-900/10",
  },
]

export interface PluginPipelineProps {
  plugins?: PluginDef[]
}

const COPY = {
  en: {
    caption: "Plugin execution order",
    coveredHooks: "covered hooks",
    relatedHint: "Highlighted plugins share at least one hook.",
    footer: "Hover plugin cards to inspect shared hook relationships",
  },
  zh: {
    caption: "插件执行顺序",
    coveredHooks: "覆盖的 hook",
    relatedHint: "高亮(橙色)的插件共享至少一个相同 hook。",
    footer: "悬停插件卡片查看共享 hook 关系",
  },
} as const

export function PluginPipeline({ plugins }: PluginPipelineProps) {
  const locale = useInteractiveLocale()
  const copy = COPY[locale]
  const resolvedPlugins = plugins ?? DEFAULT_PLUGINS[locale]
  const [hovered, setHovered] = useState<string | null>(null)

  const grouped: Record<Column["key"], PluginDef[]> = {
    pre: resolvedPlugins.filter((p) => p.enforce === "pre"),
    normal: resolvedPlugins.filter((p) => !p.enforce),
    post: resolvedPlugins.filter((p) => p.enforce === "post"),
  }

  const hoveredPlugin = resolvedPlugins.find((p) => p.name === hovered)

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{copy.caption}</span>
        <span className="ml-auto rounded bg-bg-muted px-2 py-0.5 font-mono text-2xs text-fg-muted">
          hooks: {hoveredPlugin?.hooks.join(", ")}
        </span>
      </figcaption>

      <div className="grid grid-cols-3 divide-x divide-border">
        {COLUMNS.map((col) => (
          <div key={col.key} className="flex flex-col">
            {/* 列标题 */}
            <div className={cn("border-b border-border px-3 py-2", col.color)}>
              <p className="font-mono text-xs font-bold text-fg">{col.label}</p>
              <p className="font-mono text-[10px] text-fg-subtle">{col.desc[locale]}</p>
            </div>

            {/* 插件卡片 */}
            <div className="flex flex-col gap-2 p-3">
              {grouped[col.key].length === 0 ? (
                <p className="text-center text-2xs text-fg-subtle py-4">—</p>
              ) : (
                grouped[col.key].map((plugin) => {
                  const isHovered = hovered === plugin.name
                  const isRelated = hoveredPlugin
                    ? plugin.hooks.some((h) => hoveredPlugin.hooks.includes(h)) && plugin.name !== hovered
                    : false

                  return (
                    <button
                      key={plugin.name}
                      onMouseEnter={() => setHovered(plugin.name)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setHovered(isHovered ? null : plugin.name)}
                      className={cn(
                        "rounded-md border px-2.5 py-2 text-left text-xs",
                        "transition-all duration-[--duration-fast] cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50",
                        isHovered
                          ? "border-brand-400/60 bg-brand-50 dark:bg-brand-900/20 shadow-sm scale-[1.02]"
                          : isRelated
                            ? "border-warning-300/60 bg-warning-50/40 dark:bg-warning-900/10"
                            : "border-border bg-bg-elevated hover:border-border-strong"
                      )}
                    >
                      <p className="font-mono font-semibold text-fg truncate" title={plugin.name}>
                        {plugin.name}
                      </p>
                      {plugin.description && <p className="mt-0.5 text-fg-muted leading-snug">{plugin.description}</p>}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {plugin.hooks.map((h) => (
                          <span
                            key={h}
                            className={cn(
                              "rounded px-1 py-0.5 font-mono text-[9px]",
                              isHovered
                                ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                                : "bg-bg-muted text-fg-subtle"
                            )}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 共享 hook 高亮说明 */}
      {hovered && hoveredPlugin && (
        <div className="border-t border-border bg-bg-muted/50 px-4 py-2.5">
          <p className="text-2xs text-fg-muted">
            <span className="font-medium text-fg">{hovered}</span> {copy.coveredHooks}:{" "}
            <span className="font-mono">{hoveredPlugin.hooks.join(" · ")}</span>
            {locale === "zh" ? "。" : ". "}
            {copy.relatedHint}
          </p>
        </div>
      )}

      <div className="border-t border-border px-4 py-2.5 text-2xs text-fg-subtle">{copy.footer}</div>
    </figure>
  )
}
