"use client";

/**
 * Dialog —— Base UI Dialog 的样式包装。
 *
 * 使用复合组件 API:
 *   <Dialog.Root>
 *     <Dialog.Trigger>...</Dialog.Trigger>
 *     <Dialog.Content title="..." description="...">
 *       <Dialog.Body>...</Dialog.Body>
 *       <Dialog.Footer>...</Dialog.Footer>
 *     </Dialog.Content>
 *   </Dialog.Root>
 */

import { Dialog as Base } from "@base-ui-components/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./lib/cn.ts";
import { IconButton } from "./icon-button.tsx";

const Root = Base.Root;
const Trigger = Base.Trigger;
const Close = Base.Close;
const Title = Base.Title;
const Description = Base.Description;

interface ContentProps extends ComponentPropsWithoutRef<typeof Base.Popup> {
  /** 必填:对话框标题,会成为 a11y title */
  title: string;
  description?: string;
  /** 是否显示右上角关闭按钮,默认 true */
  closable?: boolean;
}

function Content({
  title,
  description,
  closable = true,
  className,
  children,
  ...rest
}: ContentProps) {
  return (
    <Base.Portal>
      <Base.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in data-[state=closed]:fade-out",
        )}
      />
      <Base.Popup
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-xl border border-border bg-bg-elevated p-6 shadow-xl",
          "outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...rest}
      >
        <div className="flex items-start justify-between gap-4">
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
        <div className="mt-4">{children}</div>
      </Base.Popup>
    </Base.Portal>
  );
}

function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-2 text-sm leading-relaxed", className)}>{children}</div>;
}

function Footer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-6 flex items-center justify-end gap-2", className)}>{children}</div>
  );
}

export const Dialog = {
  Root,
  Trigger,
  Close,
  Title,
  Description,
  Content,
  Body,
  Footer,
};
