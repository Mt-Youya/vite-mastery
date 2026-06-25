"use client";

import { Tabs as Base } from "@base-ui-components/react/tabs";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./lib/cn.ts";

function Root({ className, ...rest }: ComponentPropsWithoutRef<typeof Base.Root>) {
  return <Base.Root className={cn("flex flex-col", className)} {...rest} />;
}

function List({ className, ...rest }: ComponentPropsWithoutRef<typeof Base.List>) {
  return (
    <Base.List
      className={cn("inline-flex items-center gap-1 border-b border-border", className)}
      {...rest}
    />
  );
}

function Tab({ className, ...rest }: ComponentPropsWithoutRef<typeof Base.Tab>) {
  return (
    <Base.Tab
      className={cn(
        "-mb-px border-b-2 border-transparent px-3 py-2",
        "text-sm font-medium text-fg-muted",
        "transition-colors duration-base ease-[var(--ease-out-quart)]",
        "hover:text-fg",
        "data-[selected]:border-primary data-[selected]:text-fg",
        "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
        className,
      )}
      {...rest}
    />
  );
}

function Panel({ className, ...rest }: ComponentPropsWithoutRef<typeof Base.Panel>) {
  return (
    <Base.Panel
      className={cn(
        "pt-4 focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
        className,
      )}
      {...rest}
    />
  );
}

const Indicator = Base.Indicator;

export const Tabs = {
  Root,
  List,
  Tab,
  Panel,
  Indicator,
};
