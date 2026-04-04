<template>
  <CardSurface class="p-5">
    <div class="mb-4 flex items-center gap-3">
      <PillBadge :tone="tone">{{ label }}</PillBadge>
      <h3 class="font-[var(--font-display)] text-lg text-[color:var(--color-foreground)]">
        {{ section.title }}
      </h3>
    </div>

    <p class="whitespace-pre-line text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
      {{ section.content }}
    </p>

    <ul v-if="section.bullets?.length" class="mt-4 space-y-2 pl-5 text-sm leading-6 text-[color:var(--color-secondary-foreground)]">
      <li v-for="bullet in section.bullets" :key="bullet" class="list-disc">
        {{ bullet }}
      </li>
    </ul>

    <div v-if="section.exampleCode" class="mt-4 rounded-[20px] bg-slate-950 px-4 py-3 text-xs leading-6 text-slate-100">
      <p v-if="section.exampleTitle" class="mb-2 font-semibold text-emerald-300">{{ section.exampleTitle }}</p>
      <pre class="overflow-x-auto"><code>{{ section.exampleCode }}</code></pre>
    </div>
  </CardSurface>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ChapterSection } from '@/entities/content/model/types'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const props = defineProps<{
  section: ChapterSection
}>()

const labelMap: Record<ChapterSection['type'], string> = {
  intro: '先了解',
  explanation: '讲解',
  example: '例子',
  tip: '小提示',
  warning: '别踩坑',
  recap: '回顾',
}

const toneMap: Record<ChapterSection['type'], 'default' | 'success' | 'warning'> = {
  intro: 'default',
  explanation: 'default',
  example: 'success',
  tip: 'success',
  warning: 'warning',
  recap: 'default',
}

const label = computed(() => labelMap[props.section.type])
const tone = computed(() => toneMap[props.section.type])
</script>
