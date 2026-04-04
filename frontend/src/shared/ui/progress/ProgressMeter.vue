<template>
  <div class="space-y-2">
    <div v-if="label" class="flex items-center justify-between text-xs text-[color:var(--color-muted-foreground)]">
      <span>{{ label }}</span>
      <span>{{ displayPercent }}</span>
    </div>
    <div class="h-3 overflow-hidden rounded-full bg-[color:var(--color-muted)]">
      <div
        class="h-full rounded-full bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] transition-all duration-300"
        :style="{ width: displayPercent }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { formatPercent } from '@/shared/lib/utils'

const props = withDefaults(
  defineProps<{
    value: number
    label?: string
  }>(),
  {
    label: '',
  },
)

const displayPercent = computed(() => formatPercent(Math.max(0, Math.min(props.value, 1))))
</script>
