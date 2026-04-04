<template>
  <div
    aria-hidden="true"
    :class="separatorClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/lib/utils'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    class?: string
  }>(),
  {
    orientation: 'horizontal',
    class: '',
  },
)

const separatorClass = computed(() =>
  cn(
    'shrink-0 bg-[color:var(--color-border)]',
    props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
    props.class,
  ),
)
</script>
