"use client";

/**
 * TOC 滚动同步钩子。用 IntersectionObserver 监听所有 h2/h3,
 * 返回当前最靠上的可见标题 id。
 *
 * 按 ui-ux-pro-max 的 animation 规范:动效只在 className 切换上,不动 layout。
 */
import { useEffect, useState } from "react";

export function useActiveHeading(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (els.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size === 0) {
          // 没有任何标题在视口里:挑最近一个上方的
          const above = els
            .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
            .filter((x) => x.top < 80)
            .sort((a, b) => b.top - a.top)[0];
          setActiveId(above?.id ?? els[0]?.id ?? null);
          return;
        }

        // 多个标题同时可见:取最靠上的(top 最小的正数)
        const topmost = [...visible.entries()].sort((a, b) => a[1] - b[1])[0];
        setActiveId(topmost?.[0] ?? null);
      },
      {
        // h2/h3 进入视口顶部 -80px(避开 sticky header)~ 60% 区域时认为是 "current"
        rootMargin: "-80px 0px -40% 0px",
        threshold: [0, 1],
      },
    );

    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
