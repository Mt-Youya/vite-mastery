import type { ButtonHTMLAttributes } from "react"
import { getButtonClasses } from "@ui-kit/core"
import type { ButtonConfig } from "@ui-kit/core"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, Partial<ButtonConfig> {
  children: React.ReactNode
}

export function Button({ variant, size, disabled, children, className, ...props }: ButtonProps) {
  const classes = getButtonClasses({ variant, size, disabled: disabled ?? false })
  return (
    <button className={`${classes} ${className ?? ""}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export type { ButtonConfig }
