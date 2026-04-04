<template>
  <RouterLink :to="linkTarget" :aria-disabled="!unlocked" class="block">
    <CardSurface
      class="p-5 transition-transform duration-200"
      :class="unlocked ? 'hover:-translate-y-1' : 'opacity-70'"
    >
      <div class="mb-4 flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">
            第 {{ chapter.order }} 章
          </p>
          <h3 class="mt-2 font-[var(--font-display)] text-xl text-[color:var(--color-foreground)]">
            {{ chapter.title }}
          </h3>
        </div>
        <PillBadge :tone="statusTone">
          {{ statusLabel }}
        </PillBadge>
      </div>

      <p class="text-sm leading-6 text-[color:var(--color-muted-foreground)]">
        {{ chapter.summary }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <PillBadge v-for="tag in chapter.tags" :key="tag">
          {{ tag }}
        </PillBadge>
      </div>

      <div class="mt-4 flex items-center justify-between text-xs text-[color:var(--color-muted-foreground)]">
        <span>{{ chapter.estimatedMinutes }} 分钟</span>
        <span>{{ chapter.difficultyLabel }}</span>
      </div>
    </CardSurface>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { CourseChapterSummary, LearningRecord } from '@/entities/content/model/types'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const props = defineProps<{
  chapter: CourseChapterSummary
  unlocked: boolean
  record?: LearningRecord
}>()

const statusLabel = computed(() => {
  if (props.record?.completed) {
    return '已完成'
  }

  return props.unlocked ? '正在开放' : '待解锁'
})

const statusTone = computed(() => {
  if (props.record?.completed) {
    return 'success'
  }

  return props.unlocked ? 'default' : 'warning'
})

const linkTarget = computed(() => (props.unlocked ? `/course/${props.chapter.slug}` : '/course'))
</script>
