<template>
  <div class="space-y-4">
    <CardSurface class="p-6">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">课程目录</p>
      <h1 class="mt-2 text-3xl font-semibold text-[color:var(--color-foreground)]">
        按顺序学，更轻松
      </h1>
      <p class="mt-3 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
        每章都会比之前更完整一些，不只是看概念，还会加入代码例子、练习和复习环节。前一章学完再进入下一章，会更容易建立稳定的理解。
      </p>
    </CardSurface>

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
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const course = useCourseStore()
const progress = useProgressStore()

const chapters = computed(() => course.course?.chapters ?? [])
</script>
