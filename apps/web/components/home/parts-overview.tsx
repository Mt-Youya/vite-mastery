import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { PARTS } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Parts Overview —— 11 章节地图。
 *
 * 反 identical-card-grids:不用 11 个等大 icon-card,改用编辑型 list,
 * 三个主轴章节(spotlight)用更大字号区分。难度用 `▮` 符号表达,不用色彩。
 */
export function PartsOverview() {
  return (
    <section className="mx-auto max-w-(--container-doc) px-6 py-24 md:py-28">
      <header className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          十二章,把 Vite 从入门带到源码导读。
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-pretty text-fg-muted md:text-base">
          主轴 60% 篇幅深挖核心机制、Hooks 与 HMR;辅助 40% 覆盖框架集成、库模式、SSR、性能优化与 Monorepo。
        </p>
      </header>

      <ol className="mt-12 divide-y divide-border border-y border-border">
        {PARTS.map((part) => (
          <li key={part.id}>
            <Link
              href={`/docs/${part.id}`}
              className={cn(
                "group grid items-baseline gap-4 px-1 py-6",
                "md:grid-cols-[5rem_1fr_auto] md:gap-8 md:py-7",
                "transition-colors duration-base hover:bg-bg-subtle/40",
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs tracking-wider text-fg-subtle tabular-nums",
                  "spotlight" in part && part.spotlight && "text-primary",
                )}
              >
                PART {part.no}
              </span>

              <div className="min-w-0">
                <p
                  className={cn(
                    "font-display font-semibold tracking-tight text-fg",
                    "spotlight" in part && part.spotlight ? "text-xl md:text-2xl" : "text-base md:text-lg",
                  )}
                >
                  {part.title}
                  {"spotlight" in part && part.spotlight ? (
                    <span className="ml-3 align-middle font-mono text-[10px] font-normal tracking-widest text-primary uppercase">
                      主轴
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-pretty text-fg-muted">{part.summary}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-fg-subtle tabular-nums md:gap-6">
                <span>{part.chapters} 节</span>
                <Difficulty level={part.difficulty} />
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 transition-transform duration-base group-hover:translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Difficulty({ level }: { level: number }) {
  return (
    <span aria-label={`难度 ${level} / 4`} className="font-mono tracking-tight">
      {"▮".repeat(level)}
      <span className="text-border-strong">{"▯".repeat(4 - level)}</span>
    </span>
  );
}
