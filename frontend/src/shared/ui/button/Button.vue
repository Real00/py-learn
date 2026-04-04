<template>
  <component
    :is="as"
    :class="buttonClass"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { computed, useAttrs } from 'vue'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-[color:var(--color-primary)] px-5 py-3 text-[color:var(--color-primary-foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-105',
        secondary: 'bg-white/70 px-5 py-3 text-[color:var(--color-secondary-foreground)] ring-1 ring-[color:var(--color-border)] hover:bg-white',
        ghost: 'bg-transparent px-3 py-2 text-[color:var(--color-secondary-foreground)] hover:bg-white/50',
      },
      size: {
        default: '',
        sm: 'px-4 py-2 text-xs',
        lg: 'px-6 py-3.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

const props = withDefaults(
  defineProps<{
    as?: string
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'default' | 'sm' | 'lg'
  }>(),
  {
  as: 'button',
  variant: 'primary',
  size: 'default',
},
)

const attrs = useAttrs()

const buttonClass = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class))
</script>
