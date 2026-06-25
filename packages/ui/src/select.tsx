"use client";

import { Select as Base } from "@base-ui-components/react/select";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./lib/cn.ts";

const Root = Base.Root;
const Value = Base.Value;
const Portal = Base.Portal;
const Group = Base.Group;
const GroupLabel = Base.GroupLabel;

interface TriggerProps extends ComponentPropsWithoutRef<typeof Base.Trigger> {
  placeholder?: string;
}

function Trigger({ className, placeholder, children, ...rest }: TriggerProps) {
  const placeholderText = placeholder ?? "请选择…";
  return (
    <Base.Trigger
      className={cn(
        "inline-flex h-9 w-full items-center justify-between gap-2 rounded-md",
        "border border-border bg-bg-elevated px-3 text-sm",
        "transition-colors duration-base ease-[var(--ease-out-quart)]",
        "hover:bg-bg-subtle",
        "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[placeholder]:text-fg-muted",
        className,
      )}
      {...rest}
    >
      {children ?? (
        <Base.Value>
          {(value) =>
            value === null || value === undefined || value === "" ? placeholderText : String(value)
          }
        </Base.Value>
      )}
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        className="size-4 text-fg-muted"
        strokeWidth={1.5}
        aria-hidden
      />
    </Base.Trigger>
  );
}

function Content({
  className,
  children,
  sideOffset = 6,
}: {
  className?: string;
  children: ReactNode;
  sideOffset?: number;
}) {
  return (
    <Base.Portal>
      <Base.Positioner sideOffset={sideOffset} className="z-50">
        <Base.Popup
          className={cn(
            "max-h-[min(60vh,24rem)] min-w-[var(--anchor-width)] overflow-y-auto",
            "rounded-lg border border-border bg-bg-elevated p-1 shadow-lg",
            "outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            className,
          )}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

interface ItemProps extends ComponentPropsWithoutRef<typeof Base.Item> {
  children: ReactNode;
}

function Item({ className, children, ...rest }: ItemProps) {
  return (
    <Base.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2",
        "text-sm text-fg",
        "data-[highlighted]:bg-bg-subtle",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...rest}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Base.ItemIndicator>
          <HugeiconsIcon
            icon={Tick02Icon}
            className="size-3.5 text-primary"
            strokeWidth={1.5}
            aria-hidden
          />
        </Base.ItemIndicator>
      </span>
      <Base.ItemText>{children}</Base.ItemText>
    </Base.Item>
  );
}

export const Select = {
  Root,
  Value,
  Portal,
  Group,
  GroupLabel,
  Trigger,
  Content,
  Item,
};
