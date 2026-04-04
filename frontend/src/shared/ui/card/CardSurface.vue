<template>
  <section :class="cardClass">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
  }>(),
  {
    class: '',
  },
)

const cardClass = computed(() =>
  cn(
    'surface-blur rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)] shadow-[var(--shadow-soft)]',
    props.class,
  ),
)
</script>
