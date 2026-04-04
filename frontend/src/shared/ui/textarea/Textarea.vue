<template>
  <textarea
    v-bind="$attrs"
    :class="textareaClass"
  />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/shared/lib/utils'

const attrs = useAttrs()

const textareaClass = cn(
  'flex min-h-28 w-full rounded-xl border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-[color:var(--color-muted-foreground)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]',
  attrs.class,
)
</script>
