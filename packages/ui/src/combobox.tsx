"use client";

/**
 * Combobox —— Base UI 的 Autocomplete 包装,带可搜索的下拉。
 *
 * 用于命令面板、搜索建议等场景。Base UI 内部把 Autocomplete 当 Combobox 的别名导出。
 */

import { Autocomplete as Base } from "@base-ui/react/autocomplete";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./lib/cn.ts";

const Root = Base.Root;
const Portal = Base.Portal;

type InputBaseProps = ComponentProps<typeof Base.Input>;
interface InputProps extends Omit<InputBaseProps, "className"> {
  className?: string;
  /** 是否显示左侧 search icon */
  withIcon?: boolean;
}

function Input({ className, withIcon = true, ...rest }: InputProps) {
  return (
    <div className="relative">
      {withIcon ? (
        <HugeiconsIcon
          icon={Search01Icon}
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted"
          strokeWidth={1.5}
          aria-hidden
        />
      ) : null}
      <Base.Input
        className={cn(
          "h-10 w-full rounded-md border border-border bg-bg-elevated text-sm",
          "transition-colors duration-base ease-[var(--ease-out-quart)]",
          "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
          withIcon ? "pr-3 pl-10" : "px-3",
          className,
        )}
        {...rest}
      />
    </div>
  );
}

function Content({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Base.Portal>
      <Base.Positioner sideOffset={4} className="z-50">
        <Base.Popup
          className={cn(
            "max-h-80 min-w-[var(--anchor-width)] overflow-y-auto",
            "rounded-lg border border-border bg-bg-elevated p-1 shadow-lg outline-none",
            className,
          )}
        >
          <Base.List>{children}</Base.List>
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

type ItemBaseProps = ComponentProps<typeof Base.Item>;
interface ItemProps extends Omit<ItemBaseProps, "className" | "children"> {
  className?: string;
  children: ReactNode;
}

function Item({ className, children, ...rest }: ItemProps) {
  return (
    <Base.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 select-none",
        "text-sm text-fg",
        "data-[highlighted]:bg-bg-subtle",
        className,
      )}
      {...rest}
    >
      {children}
    </Base.Item>
  );
}

function Empty({ children = "没有结果" }: { children?: ReactNode }) {
  return (
    <Base.Empty className="px-3 py-6 text-center text-sm text-fg-muted">{children}</Base.Empty>
  );
}

export const Combobox = {
  Root,
  Portal,
  Input,
  Content,
  Item,
  Empty,
};
