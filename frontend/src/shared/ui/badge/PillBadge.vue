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
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      tone: {
        default: 'border-transparent bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)]',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning: 'border-orange-200 bg-orange-50 text-orange-700',
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
