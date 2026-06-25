"use client";

import { Popover as Base } from "@base-ui-components/react/popover";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./lib/cn.ts";

const Root = Base.Root;
const Trigger = Base.Trigger;
const Close = Base.Close;
const Title = Base.Title;
const Description = Base.Description;

interface ContentProps extends ComponentPropsWithoutRef<typeof Base.Popup> {
  /** 偏移量,默认 8 */
  sideOffset?: number;
}

function Content({ className, sideOffset = 8, ...rest }: ContentProps) {
  return (
    <Base.Portal>
      <Base.Positioner sideOffset={sideOffset} className="z-50">
        <Base.Popup
          className={cn(
            "min-w-48 rounded-lg border border-border bg-bg-elevated p-3",
            "text-sm text-fg shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            className,
          )}
          {...rest}
        />
      </Base.Positioner>
    </Base.Portal>
  );
}

export const Popover = {
  Root,
  Trigger,
  Close,
  Title,
  Description,
  Content,
};
