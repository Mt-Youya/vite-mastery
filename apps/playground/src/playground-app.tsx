import { WebContainer, type WebContainerProcess } from "@webcontainer/api"
import { useMemo, useRef, useState } from "react"
import { cn } from "@vite-mastery/ui/lib/utils"
import { createFileSystemTree, initialFiles, type PlaygroundFile } from "./template-files"

type Status = "idle" | "booting" | "installing" | "running" | "error"

interface LogLine {
  id: number
  source: "system" | "install" | "dev"
  text: string
}

const statusLabel: Record<Status, string> = {
  idle: "待启动",
  booting: "启动中",
  installing: "安装依赖",
  running: "运行中",
  error: "需要处理",
}

const ansiEscape = String.fromCharCode(27)
const ansiBell = String.fromCharCode(7)
const ansiCsiPattern = new RegExp(`${ansiEscape}\\[[0-9;?]*[ -/]*[@-~]`, "g")
const ansiOscPattern = new RegExp(`${ansiEscape}\\][^${ansiBell}]*(?:${ansiBell}|${ansiEscape}\\\\)`, "g")

function stripTerminalControlChars(text: string) {
  let result = ""

  for (const char of text) {
    const code = char.charCodeAt(0)
    const isControl = code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127

    if (!isControl) {
      result += char
    }
  }

  return result
}

function cleanTerminalText(text: string) {
  return stripTerminalControlChars(text.replace(ansiCsiPattern, "").replace(ansiOscPattern, "")).replace(
    /^[\\|/-]+$/gm,
    ""
  )
}

function getInitialActiveFile(): PlaygroundFile {
  const file = initialFiles.find((item) => item.path === "src/plugin.ts")

  if (!file) {
    throw new Error("playground 缺少 src/plugin.ts 模板")
  }

  return file
}

const initialActiveFile = getInitialActiveFile()

export function PlaygroundApp() {
  const [files, setFiles] = useState(initialFiles)
  const [activePath, setActivePath] = useState(initialActiveFile.path)
  const [status, setStatus] = useState<Status>("idle")
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: 0,
      source: "system",
      text: "准备好后点击“启动实验场”。WebContainer 会在浏览器里安装依赖并启动 Vite dev server。",
    },
  ])
  const [previewUrl, setPreviewUrl] = useState("")
  const [error, setError] = useState("")
  const nextLogId = useRef(1)
  const webcontainerRef = useRef<WebContainer | null>(null)
  const installProcessRef = useRef<WebContainerProcess | null>(null)
  const devProcessRef = useRef<WebContainerProcess | null>(null)

  const activeFile = useMemo(
    () => files.find((file) => file.path === activePath) ?? initialActiveFile,
    [activePath, files]
  )
  const isIsolated = typeof window === "undefined" ? false : window.crossOriginIsolated
  const isBusy = status === "booting" || status === "installing"

  function appendLog(source: LogLine["source"], text: string) {
    const nextLines = cleanTerminalText(text)
      .split("\n")
      .map((line) => line.trimEnd())
      .filter(Boolean)

    if (nextLines.length === 0) return

    setLogs((current) => [
      ...current.slice(-160),
      ...nextLines.map((line) => ({
        id: nextLogId.current++,
        source,
        text: line,
      })),
    ])
  }

  async function pipeProcessOutput(process: WebContainerProcess, source: LogLine["source"]) {
    await process.output.pipeTo(
      new WritableStream<string>({
        write(data) {
          appendLog(source, data)
        },
      })
    )
  }

  async function updateActiveFile(contents: string) {
    const nextFiles = files.map((file) => (file.path === activeFile.path ? { ...file, contents } : file))
    const nextFile = nextFiles.find((file) => file.path === activeFile.path)
    setFiles(nextFiles)

    if (nextFile && webcontainerRef.current) {
      try {
        await webcontainerRef.current.fs.writeFile(nextFile.path, nextFile.contents)
        appendLog("system", `已写入 ${nextFile.path}`)
      } catch (writeError) {
        setError(writeError instanceof Error ? writeError.message : "文件写入失败")
      }
    }
  }

  async function resetFiles() {
    setFiles(initialFiles)
    setActivePath(initialActiveFile.path)
    setError("")

    if (webcontainerRef.current) {
      const webcontainer = webcontainerRef.current
      await Promise.all(initialFiles.map((file) => webcontainer.fs.writeFile(file.path, file.contents)))
      appendLog("system", "已重置示例文件。Vite 会尝试通过 HMR 刷新预览。")
    }
  }

  async function startPlayground() {
    if (!isIsolated) {
      setStatus("error")
      setError("WebContainer 需要 cross-origin isolation。请确认当前页面带有 COOP/COEP headers。")
      return
    }

    setError("")

    try {
      if (!webcontainerRef.current) {
        setStatus("booting")
        appendLog("system", "正在启动 WebContainer...")
        const webcontainer = await WebContainer.boot()
        webcontainerRef.current = webcontainer
        await webcontainer.mount(createFileSystemTree(files))
        webcontainer.on("server-ready", (_port, url) => {
          setPreviewUrl(url)
          setStatus("running")
          appendLog("system", `Vite dev server 已就绪: ${url}`)
        })
      }

      setStatus("installing")
      appendLog("system", "正在安装示例项目依赖。首次启动取决于网络,通常需要 1-3 分钟。")
      installProcessRef.current = await webcontainerRef.current.spawn("npm", [
        "install",
        "--no-audit",
        "--no-fund",
        "--progress=false",
      ])
      void pipeProcessOutput(installProcessRef.current, "install")

      const installExitCode = await installProcessRef.current.exit
      if (installExitCode !== 0) {
        throw new Error(`npm install 失败,退出码 ${installExitCode}`)
      }

      if (devProcessRef.current) {
        devProcessRef.current.kill()
      }

      appendLog("system", "正在启动 Vite 8 dev server...")
      devProcessRef.current = await webcontainerRef.current.spawn("npm", ["run", "dev"])
      void pipeProcessOutput(devProcessRef.current, "dev")
    } catch (startError) {
      setStatus("error")
      setError(startError instanceof Error ? startError.message : "WebContainer 启动失败")
    }
  }

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-dvh max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-4 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-4xl items-start gap-3">
            <img
              src="/brand/playground-mark.svg"
              alt=""
              width={44}
              height={44}
              aria-hidden="true"
              className="mt-1 size-11 shrink-0 rounded-[13px] shadow-[0_18px_42px_rgb(45_212_191_/_0.18)]"
            />
            <div>
              <p className="mb-2 font-mono text-xs text-amber-300 uppercase">Vite 8 WebContainer</p>
              <h1 className="max-w-3xl text-balance font-sans text-3xl font-semibold text-white md:text-5xl">
                在浏览器里启动一个真实的 Vite 插件实验场
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={status} />
            <span className="rounded-md border border-slate-700 px-2.5 py-1.5 font-mono text-xs text-slate-300">
              crossOriginIsolated: {isIsolated ? "true" : "false"}
            </span>
          </div>
        </header>

        {error ? (
          <div
            className="rounded-md border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <section className="grid min-h-[calc(100dvh-12rem)] gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="grid min-h-[520px] overflow-hidden rounded-md border border-slate-800 bg-slate-900 shadow-sm lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="border-b border-slate-800 bg-slate-950/60 p-3 lg:border-r lg:border-b-0">
              <p className="mb-3 font-mono text-xs text-slate-400 uppercase">文件</p>
              <nav aria-label="示例文件">
                <ul className="grid gap-1">
                  {files.map((file) => {
                    const active = file.path === activeFile.path
                    return (
                      <li key={file.path}>
                        <button
                          type="button"
                          onClick={() => setActivePath(file.path)}
                          className={cn(
                            "w-full rounded-md px-3 py-2 text-left text-sm transition-colors duration-150",
                            active
                              ? "bg-amber-400 text-slate-950"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          )}
                          aria-current={active ? "true" : undefined}
                        >
                          <span className="block truncate font-medium">{file.label}</span>
                          <span className={cn("block truncate text-xs", active ? "text-slate-800" : "text-slate-500")}>
                            {file.path}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </aside>

            <section className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                <div>
                  <p className="font-mono text-xs text-amber-300">{activeFile.path}</p>
                  <p className="text-sm text-pretty text-slate-400">{activeFile.description}</p>
                </div>
                <button
                  type="button"
                  onClick={resetFiles}
                  className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition-colors duration-150 hover:border-slate-500 hover:text-white"
                >
                  重置文件
                </button>
              </div>
              <label className="sr-only" htmlFor="playground-editor">
                编辑 {activeFile.path}
              </label>
              <textarea
                id="playground-editor"
                value={activeFile.contents}
                spellCheck={false}
                onChange={(event) => void updateActiveFile(event.target.value)}
                className="min-h-[460px] flex-1 resize-none bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none selection:bg-amber-300/30"
              />
            </section>
          </div>

          <div className="grid min-h-[520px] gap-4 lg:grid-rows-[minmax(0,1fr)_16rem]">
            <section className="overflow-hidden rounded-md border border-slate-800 bg-slate-900 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                <div>
                  <p className="font-mono text-xs text-amber-300 uppercase">Preview</p>
                  <p className="text-sm text-slate-400">WebContainer 内部 Vite dev server 输出。</p>
                </div>
                <button
                  type="button"
                  onClick={() => void startPlayground()}
                  disabled={isBusy}
                  className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "running" ? "重新启动" : "启动实验场"}
                </button>
              </div>
              {previewUrl ? (
                <iframe
                  title="Vite WebContainer 预览"
                  src={previewUrl}
                  allow="cross-origin-isolated"
                  className="h-full min-h-[420px] w-full bg-white"
                />
              ) : (
                <div className="grid min-h-[420px] place-items-center px-6 text-center">
                  <div className="max-w-md">
                    <p className="mb-2 text-lg font-semibold text-white">还没有预览</p>
                    <p className="text-pretty text-sm text-slate-400">
                      启动后会在浏览器内安装依赖、运行 Vite 8，并把 dev server URL 接到这里。
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-md border border-slate-800 bg-slate-950 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <p className="font-mono text-xs text-amber-300 uppercase">Terminal</p>
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 transition-colors duration-150 hover:border-slate-500 hover:text-white"
                >
                  清空
                </button>
              </div>
              <div className="h-52 overflow-auto p-4 font-mono text-xs leading-relaxed" aria-live="polite">
                {logs.length === 0 ? (
                  <p className="text-slate-500">暂无日志。</p>
                ) : (
                  logs.map((line) => (
                    <p key={line.id} className={line.source === "system" ? "text-amber-200" : "text-slate-300"}>
                      <span className="mr-2 text-slate-600">[{line.source}]</span>
                      {line.text}
                    </p>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function StatusPill({ status }: { status: Status }) {
  const tone =
    status === "running"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
      : status === "error"
        ? "border-red-400/40 bg-red-400/10 text-red-200"
        : "border-amber-400/40 bg-amber-400/10 text-amber-200"

  return (
    <span className={cn("rounded-md border px-2.5 py-1.5 font-mono text-xs", tone)}>状态: {statusLabel[status]}</span>
  )
}
