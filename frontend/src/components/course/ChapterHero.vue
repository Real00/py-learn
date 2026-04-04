<template>
  <CardSurface class="overflow-hidden p-6">
    <div class="relative">
      <div class="absolute inset-x-0 top-0 h-28 rounded-full bg-[radial-gradient(circle,_rgba(15,123,255,0.18),_transparent_70%)]" />

      <div class="relative flex flex-wrap items-center gap-2">
        <PillBadge>{{ hero.difficultyLabel }}</PillBadge>
        <PillBadge tone="success">预计 {{ hero.estimatedMinutes }} 分钟</PillBadge>
        <PillBadge v-for="tag in hero.tags" :key="tag" tone="default">
          {{ tag }}
        </PillBadge>
      </div>

      <h1 class="relative mt-4 text-3xl font-semibold leading-tight text-[color:var(--color-foreground)]">
        {{ hero.title }}
      </h1>
      <p class="relative mt-3 text-sm leading-7 text-[color:var(--color-muted-foreground)]">
        {{ hero.summary }}
      </p>
    </div>
  </CardSurface>
</template>

<script setup lang="ts">
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

defineProps<{
  hero: {
    title: string
    summary: string
    estimatedMinutes: number
    difficultyLabel: string
    tags: string[]
  }
}>()
</script>
