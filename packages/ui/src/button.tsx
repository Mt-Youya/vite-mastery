import { cva, type VariantProps } from "class-variance-authority"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "./lib/cn.ts"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "font-medium select-none",
    "transition-[background-color,color,box-shadow,border-color]",
    "duration-base ease-[var(--ease-out-quart)]",
    "focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg shadow-xs hover:brightness-110 active:brightness-95",
        secondary: "bg-bg-elevated text-fg border border-border hover:bg-bg-subtle active:bg-bg-muted",
        ghost: "text-fg hover:bg-bg-subtle active:bg-bg-muted",
        outline: "border border-border-strong bg-transparent text-fg hover:bg-bg-subtle active:bg-bg-muted",
        accent: "bg-accent text-accent-fg shadow-xs hover:brightness-110 active:brightness-95",
        danger: "bg-danger-500 text-white shadow-xs hover:bg-danger-600 active:brightness-95",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-base",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, type = "button", ...rest },
  ref
) {
  return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, block }), className)} {...rest} />
})

export { buttonVariants }
