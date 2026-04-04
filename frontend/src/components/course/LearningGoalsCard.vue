<template>
  <CardSurface class="p-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">学习目标</p>
        <h2 class="mt-2 text-xl font-semibold text-[color:var(--color-foreground)]">这一章学完你应该能做到</h2>
      </div>
      <PillBadge tone="success">{{ goals.length }} 项</PillBadge>
    </div>

    <ul class="mt-4 space-y-3">
      <li
        v-for="goal in goals"
        :key="goal"
        class="flex items-start gap-3 rounded-2xl bg-[color:var(--color-secondary)]/60 px-4 py-3 text-sm leading-6 text-[color:var(--color-secondary-foreground)]"
      >
        <span class="mt-1 h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)]" />
        <span>{{ goal }}</span>
      </li>
    </ul>
  </CardSurface>
</template>

<script setup lang="ts">
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

defineProps<{
  goals: string[]
}>()
</script>
