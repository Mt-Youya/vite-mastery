import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { EXAMPLES } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Examples Bento —— 10 个实战项目。
 *
 * 用 `grid-flow-dense` 让 cell 真正咬合,不留空角。三种 size variant,
 * 视觉差异由排版而非 icon 阵列承担。第一个项目作为"主推",占 2x2。
 * 4 行 × 4 列 = 16 格,1 lg(4) + 3 md(6) + 6 sm(6)。
 */
const SIZES = ["lg", "md", "sm", "sm", "md", "md", "sm", "sm", "sm", "sm"] as const

export function ExamplesBento() {
  return (
    <section className="border-t border-border bg-bg-subtle/30">
      <div className="mx-auto max-w-doc px-4 py-16 sm:px-6 sm:py-24 md:py-28">
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-fg-subtle uppercase">十个实战项目</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              不只是看懂,要能写出来。
            </h2>
          </div>
          <Link
            href="/examples"
            className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-fg-muted transition-colors hover:text-fg md:self-end"
          >
            全部项目
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </header>

        <div
          className={cn(
            "mt-12 grid auto-rows-[minmax(180px,auto)] gap-3",
            "grid-cols-2 grid-flow-dense md:grid-cols-4"
          )}
        >
          {EXAMPLES.map((ex, i) => {
            const size = SIZES[i] ?? "sm"
            return (
              <Link
                key={ex.id}
                href={`/examples/${ex.id}`}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-bg-elevated p-5",
                  "transition-colors duration-base hover:border-border-strong hover:bg-bg-muted/40",
                  size === "lg" && "col-span-2 md:col-span-2 md:row-span-2",
                  size === "md" && "col-span-2 md:col-span-2",
                  size === "sm" && "col-span-1 md:col-span-1"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs tracking-wider text-fg-subtle">{ex.chapter}</span>
                  <Difficulty level={ex.difficulty} />
                </div>

                <div className="mt-6">
                  <h3
                    className={cn(
                      "font-display font-semibold tracking-tight text-fg",
                      size === "lg" ? "text-2xl md:text-3xl" : "text-lg"
                    )}
                  >
                    {ex.title}
                  </h3>
                  <p className={cn("mt-2 text-pretty text-fg-muted", size === "lg" ? "text-base" : "text-sm")}>
                    {ex.blurb}
                  </p>
                  {size === "lg" ? (
                    <p className="mt-4 max-w-[44ch] border-t border-border pt-3 text-xs text-fg-subtle">
                      产出:{ex.outcome}
                    </p>
                  ) : null}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Difficulty({ level }: { level: number }) {
  return (
    <span aria-label={`难度 ${level} / 4`} className="font-mono text-[10px] tracking-tight text-fg-subtle">
      {"▮".repeat(level)}
      <span className="text-border-strong">{"▯".repeat(4 - level)}</span>
    </span>
  )
}
