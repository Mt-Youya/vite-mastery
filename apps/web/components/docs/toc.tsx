"use client";

import { useActiveHeading } from "@/lib/use-active-heading";
import { cn } from "@/lib/utils";

interface TocProps {
  headings: { level: 2 | 3; text: string; id: string }[];
}

/**
 * 页内 TOC。滚动同步用 IntersectionObserver,过渡仅在 color/font-weight。
 * h3 缩进 +12px,不超过 2 级。
 */
export function Toc({ headings }: TocProps) {
  const activeId = useActiveHeading(headings.map((h) => h.id));

  if (headings.length === 0) return null;

  return (
    <nav aria-label="本页大纲" className="text-sm">
      <p className="mb-3 font-display text-xs font-semibold tracking-wider text-fg-subtle uppercase">
        本页大纲
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => {
          const active = activeId === h.id;
          return (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? "1.25rem" : "0.75rem" }}>
              <a
                href={`#${h.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-3 text-pretty",
                  "transition-colors duration-base ease-[var(--ease-out-quart)]",
                  active
                    ? "border-primary font-medium text-fg"
                    : "border-transparent text-fg-muted hover:text-fg",
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
