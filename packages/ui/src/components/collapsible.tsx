"use client"

/**
 * Collapsible —— Base UI Collapsible 的样式包装。
 *
 * 主要消费者是 mdx-components 里的 <V7Note>(Vite 7 行为差异折叠块)。
 * 这里只做最小化样式与高度动画兜底,具体视觉(配色 / 边框)留给上层组件覆盖。
 *
 * 使用方式:
 *   <Collapsible.Root defaultOpen={false}>
 *     <Collapsible.Trigger>展开</Collapsible.Trigger>
 *     <Collapsible.Panel>正文内容</Collapsible.Panel>
 *   </Collapsible.Root>
 */

import { Collapsible as Base } from "@base-ui/react/collapsible"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "../lib/utils"

const Root = Base.Root
const Trigger = Base.Trigger

interface PanelProps extends ComponentPropsWithoutRef<typeof Base.Panel> {}

/**
 * Panel —— 折叠内容容器。
 *
 * Base UI 暴露 `--collapsible-panel-height` CSS 变量,用它做高度动画
 * 比 max-height 更精确。这里给出兜底动画,如不需要可通过 className 覆盖。
 */
function Panel({ className, ...rest }: PanelProps) {
  return (
    <Base.Panel
      className={cn(
        "overflow-hidden transition-[height] duration-base ease-out",
        "h-(--collapsible-panel-height)",
        "data-starting-style:h-0 data-ending-style:h-0",
        className
      )}
      {...rest}
    />
  )
}

export const Collapsible = {
  Root,
  Trigger,
  Panel,
}
