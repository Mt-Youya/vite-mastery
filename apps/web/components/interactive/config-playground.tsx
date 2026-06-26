"use client"

/**
 * <ConfigPlayground> —— Vite 配置交互式编辑器。
 *
 * 左:CodeMirror 编辑 vite.config.ts
 * 右:实时推导的产物结构树
 */

import { useEffect, useRef, useState } from "react"
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, lineNumbers } from "@codemirror/view"
import type { ViewUpdate } from "@codemirror/view"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { cn } from "@/lib/utils"

const DEFAULT_CONFIG = `import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  plugins: [react()],
})
`

interface OutputNode {
  name: string
  type: "dir" | "file"
  children?: OutputNode[]
  comment?: string
}

function deriveOutput(config: string): OutputNode[] {
  const outDirMatch = config.match(/outDir:\s*["'](.+?)["']/)
  const assetsMatch = config.match(/assetsDir:\s*["'](.+?)["']/)
  const sourcemapMatch = config.match(/sourcemap:\s*(true|false|["']inline["']|["']hidden["'])/)
  const hasVendor = config.includes("manualChunks")
  const minify = config.match(/minify:\s*["'](.+?)["']/)?.[1] ?? "esbuild"

  const outDir = outDirMatch?.[1] ?? "dist"
  const assetsDir = assetsMatch?.[1] ?? "assets"
  const hasSourcemap = sourcemapMatch?.[1] === "true" || sourcemapMatch?.[1] === '"inline"'

  const assets: OutputNode[] = [
    { name: "index.js", type: "file", comment: `entry chunk · ${minify} minified` },
    ...(hasVendor ? [{ name: "vendor.js", type: "file" as const, comment: "react + react-dom" }] : []),
    { name: "index.css", type: "file", comment: "extracted CSS" },
    { name: "logo-[hash].svg", type: "file", comment: "static asset" },
    ...(hasSourcemap ? [{ name: "index.js.map", type: "file" as const, comment: "source map" }] : []),
  ]

  return [
    {
      name: outDir + "/",
      type: "dir",
      children: [
        { name: "index.html", type: "file", comment: "entry HTML" },
        { name: assetsDir + "/", type: "dir", children: assets },
      ],
    },
  ]
}

function FileTree({ nodes, depth = 0 }: { nodes: OutputNode[]; depth?: number }) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => (
        <li key={node.name}>
          <div className="flex items-center gap-1.5 rounded px-1 py-0.5" style={{ paddingLeft: `${depth * 14 + 4}px` }}>
            <span className={cn("shrink-0 font-mono text-2xs")}>{node.type === "dir" ? "📁" : "📄"}</span>
            <span
              className={cn(
                "font-mono text-2xs",
                node.type === "dir" ? "font-semibold text-brand-600 dark:text-brand-400" : "text-fg"
              )}
            >
              {node.name}
            </span>
            {node.comment && <span className="ml-1 text-[10px] text-fg-subtle">— {node.comment}</span>}
          </div>
          {node.children && <FileTree nodes={node.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  )
}

export function ConfigPlayground() {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  const output = deriveOutput(config)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !editorRef.current || viewRef.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: DEFAULT_CONFIG,
        extensions: [
          history(),
          lineNumbers(),
          javascript({ typescript: true }),
          oneDark,
          keymap.of([...defaultKeymap, ...historyKeymap]),
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
              setConfig(update.state.doc.toString())
            }
          }),
          EditorView.theme({
            "&": { height: "100%", fontSize: "12px" },
            ".cm-scroller": { overflow: "auto", fontFamily: "var(--font-mono)" },
          }),
        ],
      }),
      parent: editorRef.current,
    })

    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [mounted])

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Vite 配置实验场</span>
        <span className="ml-3 text-2xs text-fg-subtle">修改左侧配置,右侧实时预览产物结构</span>
      </figcaption>

      <div
        className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border"
        style={{ height: 360 }}
      >
        {/* 左:编辑器 */}
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-[#282c34] px-3 py-1.5">
            <div className="flex gap-1.5">
              {(["#ff5f56", "#ffbd2e", "#27c93f"] as const).map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="ml-2 font-mono text-2xs text-slate-400">vite.config.ts</span>
          </div>
          {!mounted ? (
            <div className="flex-1 bg-[#282c34] animate-pulse" />
          ) : (
            <div ref={editorRef} className="flex-1 overflow-hidden bg-[#282c34] [&_.cm-editor]:h-full" />
          )}
        </div>

        {/* 右:产物结构 */}
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center border-b border-border px-3 py-1.5">
            <span className="font-mono text-2xs text-fg-subtle">产物结构</span>
            <span className="ml-auto rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
              实时推导
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FileTree nodes={output} />
          </div>
        </div>
      </div>
    </figure>
  )
}
