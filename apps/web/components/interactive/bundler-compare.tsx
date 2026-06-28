"use client"

/**
 * <BundlerCompare> —— Vite 7(esbuild+Rollup)vs Vite 8(Rolldown)架构对比。
 *
 * 左:Vite 7 双引擎;右:Vite 8 Rolldown 统一。
 * 点击/hover 某个组件高亮它的数据流。
 */

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useInteractiveLocale } from "./locale"

type HighlightKey = "dev" | "build" | "esbuild" | "rollup" | "rolldown" | null

interface FlowNodeProps {
  label: string
  sub?: string
  highlight: HighlightKey
  nodeKey: HighlightKey
  onHover: (k: HighlightKey) => void
  accent?: "blue" | "orange" | "purple" | "brand"
}

const COPY = {
  en: {
    caption: "Bundler architecture comparison",
    v7Title: "Dual engine (esbuild + Rollup)",
    source: "Source",
    output: "Browser / Node output",
    v7Note: "Two engines had different designs, so plugin behavior often needed separate adaptation.",
    v8Title: "Rolldown unified engine",
    rolldownSub: "Rust · dev + build unified",
    internals: ["OXC parser", "Module graph", "Chunking"],
    v8Note: "One Rust core keeps dev/build behavior aligned, while the compatibility layer preserves Rollup APIs.",
    footer: "Click or hover a node to highlight data flow",
  },
  zh: {
    caption: "Bundler 架构对比",
    v7Title: "双引擎(esbuild + Rollup)",
    source: "源码",
    output: "浏览器 / Node 产物",
    v7Note: "两套引擎设计不同,行为差异需要插件分别适配。",
    v8Title: "Rolldown 统一引擎",
    rolldownSub: "Rust · dev + build 统一",
    internals: ["OXC parser", "Module graph", "Chunking"],
    v8Note: "单一 Rust 内核,dev/build 行为一致,插件兼容层向后兼容 Rollup API。",
    footer: "点击或悬停节点查看数据流高亮",
  },
} as const

function FlowNode({ label, sub, highlight, nodeKey, onHover, accent = "blue" }: FlowNodeProps) {
  const active = highlight === nodeKey
  const accents = {
    blue: "border-blue-400/60 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    orange: "border-orange-400/60 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
    purple: "border-purple-400/60 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
    brand: "border-brand-400/60 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300",
  }
  return (
    <button
      onMouseEnter={() => onHover(nodeKey)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onHover(active ? null : nodeKey)}
      className={cn(
        "flex w-full flex-col items-center rounded-md border px-3 py-2.5 text-center",
        "transition-all duration-[--duration-fast] cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50",
        active
          ? cn("scale-[1.03] shadow-sm", accents[accent])
          : "border-border bg-bg-elevated text-fg-muted hover:border-border-strong"
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
      {sub && <span className="mt-0.5 font-mono text-[10px] opacity-70">{sub}</span>}
    </button>
  )
}

function Arrow({ direction = "down" }: { direction?: "down" | "right" }) {
  return (
    <svg
      className={cn("shrink-0 text-border-strong", direction === "right" ? "h-4 w-4" : "mx-auto h-5 w-4")}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      {direction === "down" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  )
}

export function BundlerCompare() {
  const locale = useInteractiveLocale()
  const copy = COPY[locale]
  const [highlight, setHighlight] = useState<HighlightKey>(null)

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{copy.caption}</span>
        <span className="rounded bg-bg-muted px-2 py-0.5 font-mono text-2xs text-fg-muted">{highlight || "dev"}</span>
      </figcaption>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {/* —— 左:Vite 7 —— */}
        <div className="flex flex-col gap-3 border-b border-border p-5 md:border-b-0 md:border-r">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-sm bg-warning-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-warning-700 dark:bg-warning-900/40 dark:text-warning-400">
              V7
            </span>
            <span className="text-sm font-semibold text-fg">{copy.v7Title}</span>
          </div>

          {/* 源码层 */}
          <FlowNode
            label={copy.source}
            sub="TypeScript / JSX"
            highlight={highlight}
            nodeKey="dev"
            onHover={setHighlight}
            accent="blue"
          />
          <Arrow />

          {/* 分叉层 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-fg-subtle">dev</span>
              <FlowNode
                label="esbuild"
                sub="Go · transform"
                highlight={highlight}
                nodeKey="esbuild"
                onHover={setHighlight}
                accent="orange"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-fg-subtle">build</span>
              <FlowNode
                label="Rollup"
                sub="JS · bundle"
                highlight={highlight}
                nodeKey="rollup"
                onHover={setHighlight}
                accent="purple"
              />
            </div>
          </div>
          <Arrow />

          {/* 产物层 */}
          <div
            className={cn(
              "rounded-md border border-dashed border-border px-3 py-2 text-center text-xs text-fg-muted",
              "transition-colors duration-[--duration-fast]",
              (highlight === "esbuild" || highlight === "rollup") &&
                "border-brand-300 bg-brand-50/30 dark:bg-brand-900/10"
            )}
          >
            {copy.output}
          </div>

          <p className="mt-1 text-2xs leading-relaxed text-fg-subtle">{copy.v7Note}</p>
        </div>

        {/* —— 右:Vite 8 —— */}
        <div className="flex flex-col gap-3 p-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-sm bg-brand-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
              V8
            </span>
            <span className="text-sm font-semibold text-fg">{copy.v8Title}</span>
          </div>

          {/* 源码层 */}
          <FlowNode
            label={copy.source}
            sub="TypeScript / JSX"
            highlight={highlight}
            nodeKey="dev"
            onHover={setHighlight}
            accent="blue"
          />
          <Arrow />

          {/* Rolldown 大块 */}
          <FlowNode
            label="Rolldown"
            sub={copy.rolldownSub}
            highlight={highlight}
            nodeKey="rolldown"
            onHover={setHighlight}
            accent="brand"
          />

          {/* Rolldown 内部组件 */}
          <div
            className={cn(
              "grid grid-cols-3 gap-1 rounded-md border border-dashed border-border p-2",
              "transition-colors duration-[--duration-fast]",
              highlight === "rolldown" && "border-brand-300/70 bg-brand-50/20 dark:bg-brand-900/10"
            )}
          >
            {copy.internals.map((name) => (
              <div
                key={name}
                className="rounded bg-bg-muted px-1 py-1 text-center font-mono text-[10px] text-fg-subtle"
              >
                {name}
              </div>
            ))}
          </div>
          <Arrow />

          {/* 产物层 */}
          <div
            className={cn(
              "rounded-md border border-dashed border-border px-3 py-2 text-center text-xs text-fg-muted",
              "transition-colors duration-[--duration-fast]",
              highlight === "rolldown" && "border-brand-300 bg-brand-50/30 dark:bg-brand-900/10"
            )}
          >
            {copy.output}
          </div>

          <p className="mt-1 text-2xs leading-relaxed text-fg-subtle">{copy.v8Note}</p>
        </div>
      </div>

      <div className="border-t border-border px-5 py-2.5 text-2xs text-fg-subtle">{copy.footer}</div>
    </figure>
  )
}
