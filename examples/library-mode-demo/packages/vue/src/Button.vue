<script setup lang="ts">
import { computed } from "vue"
import { getButtonClasses } from "@ui-kit/core"
import type { ButtonConfig } from "@ui-kit/core"

const props = withDefaults(defineProps<Partial<ButtonConfig>>(), {
  variant: "primary",
  size: "md",
  disabled: false,
})

const classes = computed(() => getButtonClasses(props))
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
