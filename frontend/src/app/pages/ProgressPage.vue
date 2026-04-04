<template>
  <div class="space-y-4">
    <CardSurface class="p-6">
      <PillBadge tone="success">本地学习档案</PillBadge>
      <h1 class="mt-4 font-[var(--font-display)] text-3xl text-[color:var(--color-foreground)]">
        你的学习进度
      </h1>
      <p class="mt-3 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
        目前进度只保存在你的浏览器中，换设备不会同步。
      </p>

      <div class="mt-5 grid grid-cols-2 gap-3">
        <div class="rounded-[22px] bg-[color:var(--color-secondary)] p-4">
          <p class="text-xs text-[color:var(--color-muted-foreground)]">完成章节</p>
          <p class="mt-2 text-2xl font-bold text-[color:var(--color-foreground)]">
            {{ progress.completedCount }}/{{ course.course?.chapters.length ?? 0 }}
          </p>
        </div>
        <div class="rounded-[22px] bg-white/70 p-4 ring-1 ring-[color:var(--color-border)]">
          <p class="text-xs text-[color:var(--color-muted-foreground)]">平均得分</p>
          <p class="mt-2 text-2xl font-bold text-[color:var(--color-foreground)]">
            {{ Math.round(progress.averageScore) }}
          </p>
        </div>
      </div>
    </CardSurface>

    <CardSurface
      v-for="chapter in chapters"
      :key="chapter.slug"
      class="p-5"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-semibold text-[color:var(--color-foreground)]">{{ chapter.title }}</p>
          <p class="mt-1 text-sm text-[color:var(--color-muted-foreground)]">{{ chapter.summary }}</p>
        </div>
        <PillBadge :tone="records[chapter.slug]?.completed ? 'success' : 'warning'">
          {{ records[chapter.slug]?.completed ? '已完成' : '进行中' }}
        </PillBadge>
      </div>

      <div class="mt-4 flex items-center justify-between text-sm text-[color:var(--color-secondary-foreground)]">
        <span>最近学习：{{ formatDate(records[chapter.slug]?.lastVisitedAt ?? null) }}</span>
        <span>得分：{{ records[chapter.slug]?.score ?? 0 }}</span>
      </div>
    </CardSurface>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'
import { formatDate } from '@/shared/lib/utils'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const course = useCourseStore()
const progress = useProgressStore()

const chapters = computed(() => course.course?.chapters ?? [])
const records = computed(() => progress.records)
</script>
