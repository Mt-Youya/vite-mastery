"use client"

/**
 * <EnvironmentExplorer> —— Environment API 多环境隔离可视化。
 *
 * 展示 client / ssr / 自定义环境的模块边界。
 * 点击某个模块,查看它在哪些环境出现、importer 是谁。
 */

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ModuleNode {
  id: string
  path: string
  type: "entry" | "shared" | "env-specific"
  environments: string[]
  importers: string[]
}

const MODULES: ModuleNode[] = [
  {
    id: "main-client",
    path: "src/main.tsx",
    type: "entry",
    environments: ["client"],
    importers: [],
  },
  {
    id: "entry-server",
    path: "src/entry-server.tsx",
    type: "entry",
    environments: ["ssr"],
    importers: [],
  },
  {
    id: "rsc-entry",
    path: "src/rsc-entry.ts",
    type: "entry",
    environments: ["rsc"],
    importers: [],
  },
  {
    id: "app",
    path: "src/App.tsx",
    type: "shared",
    environments: ["client", "ssr"],
    importers: ["src/main.tsx", "src/entry-server.tsx"],
  },
  {
    id: "store",
    path: "src/store.ts",
    type: "shared",
    environments: ["client", "ssr", "rsc"],
    importers: ["src/App.tsx", "src/entry-server.tsx", "src/rsc-entry.ts"],
  },
  {
    id: "dom-helper",
    path: "src/utils/dom.ts",
    type: "env-specific",
    environments: ["client"],
    importers: ["src/main.tsx"],
  },
  {
    id: "server-only",
    path: "src/utils/db.server.ts",
    type: "env-specific",
    environments: ["ssr"],
    importers: ["src/entry-server.tsx"],
  },
  {
    id: "rsc-component",
    path: "src/ServerComponent.tsx",
    type: "env-specific",
    environments: ["rsc"],
    importers: ["src/rsc-entry.ts"],
  },
  {
    id: "shared-types",
    path: "src/types.ts",
    type: "shared",
    environments: ["client", "ssr", "rsc"],
    importers: ["src/App.tsx", "src/entry-server.tsx", "src/rsc-entry.ts"],
  },
]

interface Environment {
  id: string
  label: string
  color: string
  bg: string
  border: string
  desc: string
}

const ENVS: Environment[] = [
  {
    id: "client",
    label: "client",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200/60 dark:border-blue-800/40",
    desc: "浏览器环境",
  },
  {
    id: "ssr",
    label: "ssr",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200/60 dark:border-green-800/40",
    desc: "Node.js SSR",
  },
  {
    id: "rsc",
    label: "rsc",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200/60 dark:border-purple-800/40",
    desc: "React Server Components",
  },
]

const TYPE_LABELS: Record<ModuleNode["type"], { label: string; dot: string }> = {
  entry: { label: "入口", dot: "bg-brand-500" },
  shared: { label: "共享", dot: "bg-warning-500" },
  "env-specific": { label: "专属", dot: "bg-fg-subtle" },
}

export function EnvironmentExplorer() {
  const [selected, setSelected] = useState<string | null>(null)

  const selectedModule = MODULES.find((m) => m.id === selected) ?? null

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Environment API · 模块边界可视化
        </span>
      </figcaption>

      {/* 三个环境列 */}
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {ENVS.map((env) => {
          const envModules = MODULES.filter((m) => m.environments.includes(env.id))
          return (
            <div
              key={env.id}
              className={cn("p-4", selected && selectedModule?.environments.includes(env.id) ? env.bg : "")}
            >
              {/* 环境标题 */}
              <div
                className={cn("mb-3 flex items-center justify-between rounded-md border px-3 py-2", env.bg, env.border)}
              >
                <div>
                  <p className={cn("font-mono text-sm font-bold", env.color)}>{env.label}</p>
                  <p className="text-[10px] text-fg-subtle">{env.desc}</p>
                </div>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full animate-pulse",
                    env.bg.replace("bg-", "").includes("blue")
                      ? "bg-blue-400"
                      : env.bg.replace("bg-", "").includes("green")
                        ? "bg-green-400"
                        : "bg-purple-400"
                  )}
                />
              </div>

              {/* 模块列表 */}
              <div className="space-y-1.5">
                {envModules.map((mod) => {
                  const isSelected = selected === mod.id
                  const typeInfo = TYPE_LABELS[mod.type]
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelected(isSelected ? null : mod.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left",
                        "transition-all duration-[--duration-fast] cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50",
                        isSelected
                          ? "border-brand-400/60 bg-brand-50 dark:bg-brand-900/20 shadow-sm"
                          : "border-border bg-bg-elevated hover:border-border-strong"
                      )}
                      aria-pressed={isSelected}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", typeInfo.dot)} />
                      <span className="flex-1 font-mono text-2xs text-fg truncate" title={mod.path}>
                        {mod.path.replace("src/", "")}
                      </span>
                      {mod.environments.length > 1 && (
                        <span className="shrink-0 rounded bg-warning-100 px-1 py-0.5 text-[9px] font-medium text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
                          ×{mod.environments.length}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 选中模块详情 */}
      {selectedModule ? (
        <div className="border-t border-border bg-bg-muted/40 px-5 py-4">
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">模块路径</p>
              <p className="mt-1 font-mono text-sm text-fg">{selectedModule.path}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">出现环境</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedModule.environments.map((e) => {
                  const env = ENVS.find((ev) => ev.id === e)
                  return (
                    <span
                      key={e}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-2xs font-medium",
                        env?.bg,
                        env?.color,
                        env?.border,
                        "border"
                      )}
                    >
                      {e}
                    </span>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">importer</p>
              <div className="mt-1 space-y-0.5">
                {selectedModule.importers.length === 0 ? (
                  <span className="font-mono text-2xs text-fg-subtle">(入口模块)</span>
                ) : (
                  selectedModule.importers.map((imp) => (
                    <p key={imp} className="font-mono text-2xs text-fg-muted">
                      {imp}
                    </p>
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">类型</p>
              <p className="mt-1 text-sm text-fg">{TYPE_LABELS[selectedModule.type].label}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-border px-5 py-2.5 text-2xs text-fg-subtle">
          <span className="mr-2 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            入口
          </span>
          <span className="mr-2 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
            共享(多环境)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" />
            环境专属
          </span>
          <span className="ml-4">点击模块查看详情</span>
        </div>
      )}
    </figure>
  )
}
