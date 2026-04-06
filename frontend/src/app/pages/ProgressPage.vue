<template>
  <div class="space-y-4">
    <CardSurface class="p-6">
      <PillBadge tone="success">本地学习档案</PillBadge>
      <h1 class="mt-4 text-3xl font-semibold text-[color:var(--color-foreground)]">
        你的学习进度
      </h1>
      <p class="mt-3 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
        目前进度只保存在你的浏览器中，换设备不会同步。
      </p>

      <div class="mt-5 grid grid-cols-2 gap-3">
        <div class="rounded-[22px] bg-[color:var(--color-secondary)] p-4 ring-1 ring-[color:var(--color-border)]">
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
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-[color:var(--color-foreground)]">{{ chapter.title }}</p>
          <p class="mt-1 text-sm text-[color:var(--color-muted-foreground)]">{{ chapter.summary }}</p>
        </div>
        <div class="flex shrink-0 justify-start sm:justify-end">
          <PillBadge :tone="getChapterStatus(chapter.slug).tone">
            {{ getChapterStatus(chapter.slug).label }}
          </PillBadge>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2 text-sm text-[color:var(--color-secondary-foreground)] sm:flex-row sm:items-center sm:justify-between">
        <span>最近学习：{{ formatDate(records[chapter.slug]?.lastVisitedAt ?? null) }}</span>
        <span>得分：{{ records[chapter.slug]?.score ?? 0 }}</span>
      </div>

      <div class="mt-4">
        <RouterLink
          v-if="isChapterUnlocked(chapter.slug)"
          :to="`/course/${chapter.slug}`"
          class="inline-flex items-center justify-center rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold !text-white shadow-sm transition-colors hover:brightness-105"
        >
          {{ records[chapter.slug]?.completed ? '回顾这一章' : '继续学习' }}
        </RouterLink>
      </div>
    </CardSurface>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'
import { formatDate } from '@/shared/lib/utils'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const course = useCourseStore()
const progress = useProgressStore()

const chapters = computed(() => course.course?.chapters ?? [])
const orderedChapterSlugs = computed(() => course.orderedChapterSlugs)
const records = computed(() => progress.records)

function isChapterUnlocked(chapterSlug: string) {
  return progress.isUnlocked(orderedChapterSlugs.value, chapterSlug)
}

function getChapterStatus(chapterSlug: string) {
  const record = records.value[chapterSlug]

  if (!isChapterUnlocked(chapterSlug)) {
    return {
      label: '待解锁',
      tone: 'warning' as const,
    }
  }

  if (!record) {
    return {
      label: '未开始',
      tone: 'default' as const,
    }
  }

  if (record.completed) {
    return {
      label: '已完成',
      tone: 'success' as const,
    }
  }

  return {
    label: '进行中',
    tone: 'warning' as const,
  }
}
</script>
