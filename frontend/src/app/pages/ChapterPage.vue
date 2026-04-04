<template>
  <div v-if="chapter" class="space-y-4">
    <CardSurface class="p-6">
      <PillBadge>{{ chapter.difficultyLabel }}</PillBadge>
      <h1 class="mt-4 font-[var(--font-display)] text-3xl text-[color:var(--color-foreground)]">
        {{ chapter.title }}
      </h1>
      <p class="mt-3 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
        {{ chapter.summary }}
      </p>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div class="rounded-[22px] bg-[color:var(--color-secondary)] p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">学习目标</p>
          <ul class="mt-3 space-y-2 pl-5 text-sm leading-6 text-[color:var(--color-secondary-foreground)]">
            <li v-for="goal in chapter.learningGoals" :key="goal" class="list-disc">{{ goal }}</li>
          </ul>
        </div>
        <div class="rounded-[22px] bg-white/70 p-4 ring-1 ring-[color:var(--color-border)]">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">章节信息</p>
          <p class="mt-3 text-sm text-[color:var(--color-secondary-foreground)]">预计 {{ chapter.estimatedMinutes }} 分钟</p>
          <p class="mt-2 text-sm text-[color:var(--color-secondary-foreground)]">学完后可进入复习题巩固。</p>
        </div>
      </div>
    </CardSurface>

    <LessonSectionCard
      v-for="section in chapter.sections"
      :key="section.id"
      :section="section"
    />

    <CardSurface class="p-5">
      <h2 class="font-[var(--font-display)] text-2xl text-[color:var(--color-foreground)]">
        本章小结
      </h2>
      <ul class="mt-4 space-y-2 pl-5 text-sm leading-6 text-[color:var(--color-secondary-foreground)]">
        <li v-for="point in chapter.summaryPoints" :key="point" class="list-disc">{{ point }}</li>
      </ul>

      <div class="mt-5 flex gap-3">
        <Button as="a" :href="`/review/${chapter.slug}`" class="flex-1">
          去做复习题
        </Button>
        <Button as="a" href="/course" variant="secondary">
          回目录
        </Button>
      </div>
    </CardSurface>
  </div>

  <CardSurface v-else class="p-6">
    <p class="text-sm text-[color:var(--color-secondary-foreground)]">章节加载中...</p>
  </CardSurface>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import LessonSectionCard from '@/components/course/LessonSectionCard.vue'
import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import Button from '@/shared/ui/button/Button.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const route = useRoute()
const course = useCourseStore()
const progress = useProgressStore()

const slug = computed(() => String(route.params.slug))
const chapter = computed(() => course.chapters[slug.value] ?? null)

onMounted(async () => {
  await course.ensureChapterLoaded(slug.value)
  progress.markVisited(slug.value)
})
</script>
