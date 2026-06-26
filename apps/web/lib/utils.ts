/**
 * 站点级工具函数。
 *
 * 大部分基础工具走 `@vite-mastery/ui` 的 `cn`,这里只放 apps/web 独有的。
 */

export { cn } from "@vite-mastery/ui"

/** 把字节数格式化为人类可读字符串(用于性能指标展示) */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / 1024 ** i
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`
}

/** 安全地拼接 URL path 片段,避免重复斜杠 */
export function joinPath(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .map((p, i) => (i === 0 ? p.replace(/\/$/, "") : p.replace(/^\/|\/$/g, "")))
    .join("/")
}
