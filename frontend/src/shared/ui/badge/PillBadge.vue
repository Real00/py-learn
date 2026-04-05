<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { computed } from 'vue'

import { cn } from '@/shared/lib/utils'

const badgeVariants = cva(
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      tone: {
        default: 'border-[color:var(--color-border-strong)] bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)]',
        success: 'border-[color:var(--color-success-border)] bg-[color:var(--color-success-soft)] text-[color:var(--color-success-foreground)]',
        warning: 'border-[color:var(--color-warning-border)] bg-[color:var(--color-warning-soft)] text-[color:var(--color-warning-foreground)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)

interface Props {
  tone?: 'default' | 'success' | 'warning'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'default',
  class: '',
})

const badgeClass = computed(() =>
  cn(badgeVariants({ tone: props.tone }), props.class),
)
</script>
