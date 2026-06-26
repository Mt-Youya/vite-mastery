/**
 * MDX 友好的 <Tabs items={["a","b"]}> 包装,薄薄一层。
 *
 * 直接消费 @vite-mastery/ui 的 Tabs。这里只是把 props 形状改得更 MDX 一些。
 */

"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Tabs as BaseTabs } from "@vite-mastery/ui"

interface TabsProps {
  items: string[]
  children: ReactNode[]
}

export function Tabs({ items, children }: TabsProps) {
  const [active, setActive] = useState(items[0] ?? "")
  return (
    <BaseTabs.Root value={active} onValueChange={setActive} className="my-6">
      <BaseTabs.List className="flex gap-1 border-b border-border">
        {items.map((label) => (
          <BaseTabs.Tab
            key={label}
            value={label}
            className="-mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium text-fg-muted data-selected:border-primary data-selected:text-fg"
          >
            {label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((label, i) => (
        <BaseTabs.Panel key={label} value={label} className="pt-4">
          {children[i]}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  )
}
