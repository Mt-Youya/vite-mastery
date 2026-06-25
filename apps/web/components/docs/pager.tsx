import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DocItem } from "@/lib/docs-tree";

interface PagerProps {
  prev: DocItem | null;
  next: DocItem | null;
}

export function Pager({ prev, next }: PagerProps) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="上下篇" className="mt-16 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <PagerLink doc={prev} direction="prev" />
      ) : (
        <div aria-hidden className="hidden sm:block" />
      )}
      {next ? <PagerLink doc={next} direction="next" /> : null}
    </nav>
  );
}

function PagerLink({ doc, direction }: { doc: DocItem; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/docs/${doc.slug}`}
      className={cn(
        "group flex flex-col gap-1 rounded-lg border border-border bg-bg-elevated p-4",
        "transition-colors duration-base ease-[var(--ease-out-quart)]",
        "hover:border-border-strong hover:bg-bg-subtle",
        isNext ? "items-end text-right" : "items-start text-left",
      )}
    >
      <span className="flex items-center gap-1.5 text-xs text-fg-subtle">
        {!isNext ? (
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-3 transition-transform duration-base group-hover:-translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
        {isNext ? "下一篇" : "上一篇"}
        {isNext ? (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-3 transition-transform duration-base group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
      </span>
      <span className="text-base font-medium text-fg text-pretty">{doc.title}</span>
      <span className="font-mono text-[11px] text-fg-subtle tabular-nums">{doc.chapter}</span>
    </Link>
  );
}
