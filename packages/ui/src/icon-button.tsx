import { cva, type VariantProps } from "class-variance-authority"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "./lib/cn.ts"

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md",
    "transition-[background-color,color] duration-base ease-[var(--ease-out-quart)]",
    "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-fg hover:brightness-110",
        ghost: "text-fg-muted hover:bg-bg-subtle hover:text-fg",
        outline: "border border-border-strong bg-transparent text-fg hover:bg-bg-subtle",
      },
      size: {
        sm: "size-7",
        md: "size-9",
        lg: "size-11",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
)

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {
  /** 必填:无障碍标签 */
  "aria-label": string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant, size, type = "button", ...rest },
  ref
) {
  return <button ref={ref} type={type} className={cn(iconButtonVariants({ variant, size }), className)} {...rest} />
})
