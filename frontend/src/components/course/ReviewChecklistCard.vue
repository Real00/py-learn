<template>
  <CardSurface class="p-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">复习清单</p>
        <h2 class="mt-2 text-xl font-semibold text-[color:var(--color-foreground)]">提交测验前快速过一遍</h2>
      </div>
      <PillBadge>{{ items.length }} 条</PillBadge>
    </div>

    <ul class="mt-4 space-y-3">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-start gap-3 rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm leading-6 text-[color:var(--color-secondary-foreground)]"
      >
        <span class="mt-1 text-[color:var(--color-primary)]">✓</span>
        <span>{{ item.text }}</span>
      </li>
    </ul>
  </CardSurface>
</template>

<script setup lang="ts">
import type { ReviewChecklistItem } from '@/entities/content/model/types'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

defineProps<{
  items: ReviewChecklistItem[]
}>()
</script>
