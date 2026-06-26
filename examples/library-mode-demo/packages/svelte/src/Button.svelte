<script lang="ts">
  import { getButtonClasses } from "@ui-kit/core"
  import type { ButtonConfig } from "@ui-kit/core"

  let { variant = "primary", size = "md", disabled = false, children }: Partial<ButtonConfig> & { children?: unknown } = $props()

  const classes = $derived(getButtonClasses({ variant, size, disabled }))
</script>

<button class={classes} {disabled}>
  {@render children?.()}
</button>
