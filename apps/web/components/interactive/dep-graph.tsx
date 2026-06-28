"use client"

/**
 * <DepGraph> —— Module Graph 可视化。
 *
 * @xyflow/react 渲染,用 mounted 守卫避免 SSR hydration 差异。
 * 点击节点查看其 import / importer 信息。
 */

import { useState } from "react"
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react"
import type { Node, Edge, NodeMouseHandler } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useMounted } from "@/hooks/use-mounted"
import { useInteractiveLocale } from "./locale"

/** @xyflow 要求 data 可被字符串 key 索引 */
interface GraphNodeData extends Record<string, unknown> {
  label: string
  nodeType: "entry" | "component" | "lib" | "style" | "asset"
}

interface GraphEdgeMeta extends Record<string, unknown> {
  sourceLabel: string
  targetLabel: string
}

const TYPE_STYLES: Record<GraphNodeData["nodeType"], { bg: string; border: string; text: string }> = {
  entry: { bg: "#7c3aed", border: "#6d28d9", text: "#fff" },
  component: { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
  lib: { bg: "#f3e8ff", border: "#c4b5fd", text: "#6b21a8" },
  style: { bg: "#dcfce7", border: "#86efac", text: "#166534" },
  asset: { bg: "#ffedd5", border: "#fdba74", text: "#9a3412" },
}

const INITIAL_NODES: Node<GraphNodeData>[] = [
  { id: "main", position: { x: 300, y: 20 }, data: { label: "main.tsx", nodeType: "entry" } },
  { id: "app", position: { x: 300, y: 120 }, data: { label: "App.tsx", nodeType: "component" } },
  { id: "header", position: { x: 80, y: 230 }, data: { label: "Header.tsx", nodeType: "component" } },
  { id: "counter", position: { x: 300, y: 230 }, data: { label: "Counter.tsx", nodeType: "component" } },
  { id: "footer", position: { x: 520, y: 230 }, data: { label: "Footer.tsx", nodeType: "component" } },
  { id: "store", position: { x: 80, y: 340 }, data: { label: "store.ts", nodeType: "lib" } },
  { id: "utils", position: { x: 300, y: 340 }, data: { label: "utils.ts", nodeType: "lib" } },
  { id: "app-css", position: { x: 520, y: 340 }, data: { label: "App.css", nodeType: "style" } },
  { id: "react", position: { x: 160, y: 440 }, data: { label: "react", nodeType: "lib" } },
  { id: "zustand", position: { x: 400, y: 440 }, data: { label: "zustand", nodeType: "lib" } },
  { id: "logo", position: { x: 640, y: 230 }, data: { label: "logo.svg", nodeType: "asset" } },
]

const INITIAL_EDGES: Edge<GraphEdgeMeta>[] = [
  { id: "e1", source: "main", target: "app", data: { sourceLabel: "main.tsx", targetLabel: "App.tsx" } },
  { id: "e2", source: "app", target: "header", data: { sourceLabel: "App.tsx", targetLabel: "Header.tsx" } },
  { id: "e3", source: "app", target: "counter", data: { sourceLabel: "App.tsx", targetLabel: "Counter.tsx" } },
  { id: "e4", source: "app", target: "footer", data: { sourceLabel: "App.tsx", targetLabel: "Footer.tsx" } },
  { id: "e5", source: "app", target: "app-css", data: { sourceLabel: "App.tsx", targetLabel: "App.css" } },
  { id: "e6", source: "header", target: "store", data: { sourceLabel: "Header.tsx", targetLabel: "store.ts" } },
  { id: "e7", source: "counter", target: "utils", data: { sourceLabel: "Counter.tsx", targetLabel: "utils.ts" } },
  { id: "e8", source: "store", target: "zustand", data: { sourceLabel: "store.ts", targetLabel: "zustand" } },
  { id: "e9", source: "counter", target: "react", data: { sourceLabel: "Counter.tsx", targetLabel: "react" } },
  { id: "e10", source: "header", target: "react", data: { sourceLabel: "Header.tsx", targetLabel: "react" } },
  { id: "e11", source: "footer", target: "logo", data: { sourceLabel: "Footer.tsx", targetLabel: "logo.svg" } },
  { id: "e12", source: "main", target: "react", data: { sourceLabel: "main.tsx", targetLabel: "react" } },
]

export interface DepGraphProps {
  nodes?: Node<GraphNodeData>[]
  edges?: Edge<GraphEdgeMeta>[]
}

const COPY = {
  en: {
    loading: "Loading module graph...",
    module: "Module",
    type: "Type",
    importedBy: "Imported by",
    empty: "Click a node to inspect import / importer",
  },
  zh: {
    loading: "加载模块图…",
    module: "模块",
    type: "类型",
    importedBy: "被导入",
    empty: "点击节点查看 import / importer",
  },
} as const

export function DepGraph({ nodes = INITIAL_NODES, edges = INITIAL_EDGES }: DepGraphProps) {
  const locale = useInteractiveLocale()
  const copy = COPY[locale]
  const mounted = useMounted()
  const [selected, setSelected] = useState<string | null>(null)

  const selectedNode = nodes.find((n) => n.id === selected) ?? null
  const imports = edges
    .filter((e) => e.source === selected)
    .map((e) => nodes.find((n) => n.id === e.target)?.data.label)
    .filter(Boolean) as string[]
  const importers = edges
    .filter((e) => e.target === selected)
    .map((e) => nodes.find((n) => n.id === e.source)?.data.label)
    .filter(Boolean) as string[]

  const styledNodes = nodes.map((n) => {
    const s = TYPE_STYLES[n.data.nodeType]
    return {
      ...n,
      style: {
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        fontWeight: selected === n.id ? 700 : 500,
        boxShadow: selected === n.id ? "0 0 0 2px #7c3aed" : "none",
        cursor: "pointer",
      },
    }
  })

  const styledEdges = edges.map((e) => ({
    ...e,
    markerEnd: { type: "arrowclosed" as const },
    style: {
      stroke: selected === e.source || selected === e.target ? "#7c3aed" : "var(--color-border-strong, #d1d5db)",
      strokeWidth: selected === e.source || selected === e.target ? 2 : 1,
    },
  }))

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    setSelected((prev) => (prev === node.id ? null : node.id))
  }

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Module Graph</span>
        {Object.entries(TYPE_STYLES).map(([type, s]) => (
          <span key={type} className="flex items-center gap-1 text-2xs text-fg-subtle">
            <span className="h-2 w-3 rounded-sm border" style={{ background: s.bg, borderColor: s.border }} />
            {type}
          </span>
        ))}
      </figcaption>

      <div className="relative bg-bg-subtle" style={{ height: 420 }}>
        {!mounted ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-fg-subtle animate-pulse">{copy.loading}</div>
          </div>
        ) : (
          <ReactFlow
            nodes={styledNodes}
            edges={styledEdges}
            fitView
            nodesDraggable={false}
            zoomOnDoubleClick={false}
            onNodeClick={handleNodeClick}
            className="bg-bg-subtle"
          >
            <Background color="var(--color-border, #e5e7eb)" gap={24} size={1} />
            <Controls showInteractive={false} />
            <MiniMap nodeColor={() => "var(--color-bg-muted, #f3f4f6)"} maskColor="rgba(0,0,0,0.04)" />
          </ReactFlow>
        )}
      </div>

      {selectedNode ? (
        <div className="border-t border-border bg-bg-muted/40 px-5 py-3">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">{copy.module}</p>
              <p className="mt-0.5 font-mono font-semibold text-fg">{selectedNode.data.label}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">{copy.type}</p>
              <p className="mt-0.5 text-fg">{selectedNode.data.nodeType}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">import</p>
              <p className="mt-0.5 font-mono text-2xs text-fg-muted">{imports.length ? imports.join(", ") : "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">{copy.importedBy}</p>
              <p className="mt-0.5 font-mono text-2xs text-fg-muted">{importers.length ? importers.join(", ") : "—"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-border px-4 py-2.5 text-2xs text-fg-subtle">{copy.empty}</div>
      )}
    </figure>
  )
}
