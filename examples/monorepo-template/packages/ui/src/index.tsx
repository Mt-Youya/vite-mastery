import type { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  children: ReactNode
}

export function Button({ variant = "primary", children, ...props }: ButtonProps) {
  const bg = variant === "primary" ? "#ff9500" : "#e5e7eb"
  const color = variant === "primary" ? "#fff" : "#374151"
  return (
    <button
      style={{ background: bg, color, border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}
      {...props}
    >
      {children}
    </button>
  )
}
