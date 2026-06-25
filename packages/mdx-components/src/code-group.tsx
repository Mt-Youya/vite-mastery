"use client";

/**
 * <CodeGroup> ... </CodeGroup>
 *
 * 多个 <CodeBlock> 切换显示。子节点期望是若干 <CodeBlock filename="...">,
 * filename 作为 tab 标签。Tabs 走 @vite-mastery/ui 的 Base UI 封装。
 */

import { Children, isValidElement, useId, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { Tabs } from "@vite-mastery/ui";

interface CodeGroupProps {
  children: ReactNode;
}

interface CodeBlockLikeProps {
  filename?: string;
}

export function CodeGroup({ children }: CodeGroupProps) {
  const groupId = useId();
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<
    CodeBlockLikeProps
  >[];
  const [active, setActive] = useState(() => tabs[0]?.props.filename ?? "0");

  if (tabs.length === 0) return null;

  return (
    <Tabs.Root
      value={active}
      onValueChange={setActive}
      className="my-6 overflow-hidden rounded-lg border border-border bg-bg-elevated"
    >
      <Tabs.List className="flex gap-1 border-b border-border bg-bg-subtle px-2 pt-2">
        {tabs.map((tab, i) => {
          const label = tab.props.filename ?? `Tab ${i + 1}`;
          return (
            <Tabs.Tab
              key={`${groupId}-${label}`}
              value={label}
              className="rounded-t-md px-3 py-1.5 font-mono text-xs text-fg-muted data-[selected]:bg-bg-elevated data-[selected]:text-fg"
            >
              {label}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
      {tabs.map((tab, i) => {
        const label = tab.props.filename ?? `Tab ${i + 1}`;
        return (
          <Tabs.Panel key={`${groupId}-panel-${label}`} value={label} className="p-0">
            {tab}
          </Tabs.Panel>
        );
      })}
    </Tabs.Root>
  );
}
