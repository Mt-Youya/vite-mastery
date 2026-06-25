import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 className,后续覆盖前面、并解决 Tailwind 冲突。
 *
 * 用法:
 *   <div className={cn("p-2", isActive && "p-4", className)} />
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
