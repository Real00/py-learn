<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/lib/utils'

const props = withDefaults(
  defineProps<{
    tone?: 'default' | 'success' | 'warning'
    class?: string
  }>(),
  {
    tone: 'default',
    class: '',
  },
)

const toneClassMap = {
  default: 'bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)]',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-orange-100 text-orange-700',
}

const badgeClass = computed(() =>
  cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', toneClassMap[props.tone], props.class),
)
</script>
