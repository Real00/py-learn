<template>
  <div class="space-y-5">
    <CardSurface class="overflow-hidden p-6">
      <div class="relative">
        <div class="absolute inset-x-0 top-0 h-32 rounded-full bg-[radial-gradient(circle,_rgba(79,70,229,0.16),_transparent_70%)]" />
        <PillBadge class="relative">面向零基础的移动端课程</PillBadge>
        <h1 class="relative mt-4 font-[var(--font-display)] text-4xl leading-tight text-[color:var(--color-foreground)]">
          用人话学 Python，<br />
          每次只学一点点。
        </h1>
        <p class="relative mt-4 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
          每章都先讲清楚“这个概念到底是干什么的”，再给生活化例子和复习题，避免新手一上来就被术语压住。
        </p>

        <div class="relative mt-6 grid gap-3 sm:grid-cols-2">
          <Button as="a" href="#journey" class="w-full">
            看学习路线
          </Button>
          <Button as="a" variant="secondary" :href="continueLink" class="w-full">
            {{ continueLabel }}
          </Button>
        </div>
      </div>
    </CardSurface>

    <CardSurface class="p-5">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-[color:var(--color-foreground)]">学习进度</p>
          <p class="text-xs text-[color:var(--color-muted-foreground)]">完成一章后会自动保存在当前浏览器</p>
        </div>
        <PillBadge tone="success">{{ progress.completedCount }}/{{ totalChapters }} 章</PillBadge>
      </div>
      <ProgressMeter class="mt-4" :value="progressRatio" label="当前课程完成度" />
    </CardSurface>

    <section id="journey" class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">学习路线</p>
          <h2 class="mt-2 font-[var(--font-display)] text-2xl text-[color:var(--color-foreground)]">
            先理解，再练习
          </h2>
        </div>
        <RouterLink to="/course" class="text-sm font-semibold text-[color:var(--color-primary)]">
          看全部
        </RouterLink>
      </div>

      <CardSurface
        v-for="chapter in highlightedChapters"
        :key="chapter.slug"
        class="flex items-center gap-4 p-4"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[color:var(--color-secondary)] font-[var(--font-display)] text-lg text-[color:var(--color-primary)]">
          {{ chapter.order }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-[color:var(--color-foreground)]">{{ chapter.title }}</p>
          <p class="mt-1 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
            {{ chapter.summary }}
          </p>
        </div>
      </CardSurface>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import Button from '@/shared/ui/button/Button.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'
import ProgressMeter from '@/shared/ui/progress/ProgressMeter.vue'

const course = useCourseStore()
const progress = useProgressStore()

const totalChapters = computed(() => course.course?.chapters.length ?? 0)
const progressRatio = computed(() => (totalChapters.value === 0 ? 0 : progress.completedCount / totalChapters.value))
const highlightedChapters = computed(() => course.course?.chapters.slice(0, 3) ?? [])
const continueLink = computed(() =>
  progress.progress.currentChapterSlug ? `/course/${progress.progress.currentChapterSlug}` : '/course',
)
const continueLabel = computed(() => (progress.progress.currentChapterSlug ? '继续上次学习' : '从第一章开始'))
</script>
