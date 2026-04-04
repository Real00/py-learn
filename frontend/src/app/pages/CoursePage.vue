<template>
  <div class="space-y-4">
    <div class="px-1">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">课程目录</p>
      <h1 class="mt-2 font-[var(--font-display)] text-3xl text-[color:var(--color-foreground)]">
        按顺序学，更轻松
      </h1>
      <p class="mt-3 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
        每一章只引入少量新概念，前一章学完再进入下一章，会更容易建立“原来 Python 是这样工作的”的感觉。
      </p>
    </div>

    <ChapterCard
      v-for="chapter in chapters"
      :key="chapter.slug"
      :chapter="chapter"
      :record="progress.records[chapter.slug]"
      :unlocked="progress.isUnlocked(course.orderedChapterSlugs, chapter.slug)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ChapterCard from '@/components/course/ChapterCard.vue'
import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'

const course = useCourseStore()
const progress = useProgressStore()

const chapters = computed(() => course.course?.chapters ?? [])
</script>
