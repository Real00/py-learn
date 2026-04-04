<template>
  <CardSurface class="p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">练习任务</p>
        <h3 class="mt-2 text-lg font-semibold text-[color:var(--color-foreground)]">
          {{ task.title }}
        </h3>
      </div>
      <PillBadge tone="success">动手练</PillBadge>
    </div>

    <p class="mt-4 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
      {{ task.prompt }}
    </p>

    <div class="mt-4 rounded-2xl bg-[color:var(--color-secondary)]/60 p-4">
      <p class="text-sm font-semibold text-[color:var(--color-foreground)]">提示</p>
      <ul class="mt-2 space-y-2 pl-5 text-sm leading-6 text-[color:var(--color-secondary-foreground)]">
        <li v-for="hint in task.hints" :key="hint" class="list-disc">
          {{ hint }}
        </li>
      </ul>
    </div>

    <p class="mt-4 text-sm text-[color:var(--color-muted-foreground)]">
      练习目标：{{ task.expectedOutcome }}
    </p>
  </CardSurface>
</template>

<script setup lang="ts">
import type { PracticeTask } from '@/entities/content/model/types'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

defineProps<{
  task: PracticeTask
}>()
</script>
