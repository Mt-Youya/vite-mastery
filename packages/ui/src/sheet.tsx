"use client";

/**
 * Sheet —— 从屏幕边缘划出的侧栏。底层复用 Base UI Dialog,语义差异在样式。
 */

import { Dialog as Base } from "@base-ui-components/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./lib/cn.ts";
import { IconButton } from "./icon-button.tsx";

type Side = "right" | "left" | "top" | "bottom";

const SIDE_CLASSES: Record<Side, string> = {
  right:
    "right-0 top-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left:
    "left-0 top-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  top:
    "top-0 left-0 w-full max-h-[80vh] border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom:
    "bottom-0 left-0 w-full max-h-[80vh] border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
};

const Root = Base.Root;
const Trigger = Base.Trigger;
const Close = Base.Close;

interface ContentProps extends ComponentPropsWithoutRef<typeof Base.Popup> {
  side?: Side;
  title: string;
  description?: string;
  closable?: boolean;
}

function Content({
  side = "right",
  title,
  description,
  closable = true,
  className,
  children,
  ...rest
}: ContentProps) {
  return (
    <Base.Portal>
      <Base.Backdrop className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm" />
      <Base.Popup
        className={cn(
          "fixed z-50 bg-bg-elevated border-border p-6 shadow-xl outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          SIDE_CLASSES[side],
          className,
        )}
        {...rest}
      >
        <div className="flex items-start justify-between gap-4 pb-4">
          <div className="space-y-1">
            <Base.Title className="text-lg font-semibold tracking-tight">{title}</Base.Title>
            {description ? (
              <Base.Description className="text-sm text-fg-muted">{description}</Base.Description>
            ) : null}
          </div>
          {closable ? (
            <Base.Close
              render={
                <IconButton aria-label="关闭" size="sm" variant="ghost">
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </IconButton>
              }
            />
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </Base.Popup>
    </Base.Portal>
  );
}

function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("text-sm leading-relaxed", className)}>{children}</div>;
}

export const Sheet = {
  Root,
  Trigger,
  Close,
  Content,
  Body,
};
