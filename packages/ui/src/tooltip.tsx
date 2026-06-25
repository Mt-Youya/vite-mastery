"use client";

import { Tooltip as Base } from "@base-ui-components/react/tooltip";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./lib/cn.ts";

const Provider = Base.Provider;
const Root = Base.Root;
const Trigger = Base.Trigger;

interface ContentProps extends ComponentPropsWithoutRef<typeof Base.Popup> {
  sideOffset?: number;
}

function Content({ className, sideOffset = 6, children, ...rest }: ContentProps) {
  return (
    <Base.Portal>
      <Base.Positioner sideOffset={sideOffset} className="z-50">
        <Base.Popup
          className={cn(
            "rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-slate-50 shadow-md",
            "dark:bg-slate-100 dark:text-slate-900",
            "data-[state=open]:animate-in data-[state=closed]:animate-out fade-in-0",
            className,
          )}
          {...rest}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

/**
 * 简写:`<Tooltip.Quick label="...">trigger</Tooltip.Quick>`
 *
 * 适合给 IconButton 加 a11y 提示这种简单场景。
 */
function Quick({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Root>
      <Trigger render={children as never} />
      <Content>{label}</Content>
    </Root>
  );
}

export const Tooltip = {
  Provider,
  Root,
  Trigger,
  Content,
  Quick,
};
