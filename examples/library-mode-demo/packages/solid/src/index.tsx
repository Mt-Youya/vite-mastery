import type { JSX } from "solid-js"
import { getButtonClasses } from "@ui-kit/core"
import type { ButtonConfig } from "@ui-kit/core"

interface ButtonProps extends Partial<ButtonConfig> {
  children?: JSX.Element
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

export function Button(props: ButtonProps) {
  const classes = () =>
    getButtonClasses({
      variant: props.variant,
      size: props.size,
      disabled: props.disabled,
    })
  return (
    <button class={classes()} disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export type { ButtonConfig }
