"use client"

/**
 * <HmrDemo> —— HMR 协议演示器。
 *
 * 左侧:CodeMirror 编辑器;右侧:WebSocket 消息流(模拟)。
 * 每次编辑触发模拟 HMR 报文,展示 client ↔ server 交互结构。
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from "@codemirror/view"
import type { ViewUpdate } from "@codemirror/view"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { cn } from "@/lib/utils"

const INITIAL_CODE = `// src/components/Counter.tsx
import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
`

interface Message {
  id: number
  dir: "server→client" | "client→server"
  type: string
  payload: Record<string, unknown>
  ts: number
}

let msgId = 0
function makeHmrMessages(file: string): Message[] {
  const now = Date.now()
  return [
    {
      id: ++msgId,
      dir: "server→client",
      type: "update",
      payload: {
        type: "js-update",
        timestamp: now,
        updates: [{ type: "js-update", path: file, acceptedPath: file, timestamp: now }],
      },
      ts: now,
    },
    {
      id: ++msgId,
      dir: "client→server",
      type: "vite:beforeUpdate",
      payload: { path: file, timestamp: now },
      ts: now + 5,
    },
    {
      id: ++msgId,
      dir: "server→client",
      type: "connected",
      payload: { message: "module updated", path: file },
      ts: now + 12,
    },
  ]
}

export function HmrDemo() {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !editorRef.current || viewRef.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: INITIAL_CODE,
        extensions: [
          history(),
          lineNumbers(),
          highlightActiveLineGutter(),
          javascript({ typescript: true, jsx: true }),
          oneDark,
          keymap.of([...defaultKeymap, ...historyKeymap]),
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
              const content = update.state.doc.toString()
              const match = content.match(/^\/\/ (.+\.tsx?)/)
              const file = match?.[1] ?? "src/component.tsx"
              setMessages((prev) => [...prev.slice(-9), ...makeHmrMessages(file)])
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const clearMessages = useCallback(() => setMessages([]), [])

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-bg-subtle">
      <figcaption className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">HMR 协议演示</span>
        <button
          onClick={clearMessages}
          className="rounded px-2 py-0.5 text-2xs text-fg-subtle hover:text-fg transition-colors"
        >
          清空日志
        </button>
      </figcaption>

      <div
        className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border"
        style={{ height: 360 }}
      >
        {/* 左:编辑器 */}
        <div className="relative flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-[#282c34] px-3 py-1.5">
            <div className="flex gap-1.5">
              {(["#ff5f56", "#ffbd2e", "#27c93f"] as const).map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="ml-2 font-mono text-2xs text-slate-400">Counter.tsx</span>
          </div>
          {!mounted ? (
            <div className="flex-1 bg-[#282c34] animate-pulse" />
          ) : (
            <div ref={editorRef} className="flex-1 overflow-hidden bg-[#282c34] [&_.cm-editor]:h-full" />
          )}
          {mounted && (
            <div className="absolute bottom-2 right-2 rounded bg-brand-500/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
              编辑触发 HMR
            </div>
          )}
        </div>

        {/* 右:消息日志 */}
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-2xs text-fg-subtle">WebSocket · vite-hmr</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-2xs font-mono">
            {messages.length === 0 ? (
              <p className="text-fg-subtle text-center mt-8">在左侧编辑代码触发 HMR…</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "rounded-md border px-2.5 py-2 space-y-1",
                    msg.dir === "server→client"
                      ? "border-blue-200/50 bg-blue-50/30 dark:bg-blue-900/10"
                      : "border-green-200/50 bg-green-50/30 dark:bg-green-900/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-semibold",
                        msg.dir === "server→client"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-green-600 dark:text-green-400"
                      )}
                    >
                      {msg.dir}
                    </span>
                    <span className="text-fg-subtle">{new Date(msg.ts).toLocaleTimeString("zh-CN")}</span>
                  </div>
                  <div>
                    <span className="text-brand-600 dark:text-brand-400">type:</span>{" "}
                    <span className="text-fg">"{msg.type}"</span>
                  </div>
                  <div className="text-fg-subtle whitespace-pre-wrap break-all">
                    {JSON.stringify(msg.payload, null, 2).split("\n").slice(0, 4).join("\n")}
                    {Object.keys(msg.payload).length > 2 ? "\n  ..." : ""}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </figure>
  )
}
