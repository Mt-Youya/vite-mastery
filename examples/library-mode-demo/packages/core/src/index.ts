/**
 * core 包 —— 框架无关的纯逻辑。
 *
 * 各框架适配包(react / vue / svelte / solid)会 import 这里的函数,
 * 然后包装成各自的组件 API。
 */

export interface ButtonConfig {
  variant: "primary" | "secondary" | "ghost"
  size: "sm" | "md" | "lg"
  disabled: boolean
}

/** 根据配置生成 CSS 类名列表 */
export function getButtonClasses(config: Partial<ButtonConfig>): string {
  const { variant = "primary", size = "md", disabled = false } = config
  const base = "inline-flex items-center justify-center rounded font-medium transition-colors"
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700",
    secondary: "bg-bg-subtle border border-border hover:bg-bg-muted",
    ghost: "hover:bg-bg-muted",
  }
  const sizes = {
    sm: "h-7 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
  }
  const disabledCls = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""

  return [base, variants[variant], sizes[size], disabledCls].filter(Boolean).join(" ")
}
