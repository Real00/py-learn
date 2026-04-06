<template>
  <div class="space-y-5">
    <CardSurface class="overflow-hidden p-6">
      <div class="relative">
        <div class="absolute inset-x-0 top-0 h-36 rounded-full bg-[radial-gradient(circle,_rgba(92,116,145,0.18),_transparent_72%)]" />
        <PillBadge class="relative">为零基础成年人设计</PillBadge>
        <h1 class="relative mt-4 text-4xl font-semibold leading-tight text-[color:var(--color-foreground)]">
          先学会看懂，<br />
          再学会自己写。
        </h1>
        <p class="relative mt-4 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
          这套课会先用生活化语言解释概念，再给代码例子、练习任务和复习题，让你不是“看过”，而是真的开始会用。
        </p>

        <div class="relative mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            as="a"
            :href="pageState.continueLink"
            variant="primary"
            class="w-full bg-[color:var(--color-primary)] text-white"
          >
            {{ pageState.continueLabel }}
          </Button>
          <Button as="a" href="#journey" variant="secondary" class="w-full">
            看学习路线
          </Button>
        </div>
      </div>
    </CardSurface>

    <div class="grid gap-3 sm:grid-cols-3">
      <CardSurface class="p-4">
        <p class="text-xs text-[color:var(--color-muted-foreground)]">课程章节</p>
        <p class="mt-2 text-2xl font-semibold text-[color:var(--color-foreground)]">{{ pageState.totalChapters }}</p>
      </CardSurface>
      <CardSurface class="p-4">
        <p class="text-xs text-[color:var(--color-muted-foreground)]">已完成</p>
        <p class="mt-2 text-2xl font-semibold text-[color:var(--color-foreground)]">{{ pageState.completedCount }}</p>
      </CardSurface>
      <CardSurface class="p-4">
        <p class="text-xs text-[color:var(--color-muted-foreground)]">学习方式</p>
        <p class="mt-2 text-base font-semibold text-[color:var(--color-foreground)]">讲解 + 练习 + 测验</p>
      </CardSurface>
    </div>

    <CardSurface class="p-5">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-[color:var(--color-foreground)]">学习进度</p>
          <p class="text-xs text-[color:var(--color-muted-foreground)]">完成一章后会自动保存在当前浏览器</p>
        </div>
        <PillBadge tone="success">{{ pageState.completedCount }}/{{ pageState.totalChapters }} 章</PillBadge>
      </div>
      <ProgressMeter class="mt-4" :value="pageState.progressRatio" label="当前课程完成度" />
    </CardSurface>

    <section id="journey" class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">学习路线</p>
          <h2 class="mt-2 text-2xl font-semibold text-[color:var(--color-foreground)]">
            先理解，再练习
          </h2>
        </div>
        <RouterLink to="/course" class="text-sm font-semibold text-[color:var(--color-primary)]">
          看全部
        </RouterLink>
      </div>

      <component
        v-for="chapter in pageState.highlightedChapters"
        :key="chapter.slug"
        :is="chapter.unlocked ? RouterLink : 'div'"
        v-bind="chapter.unlocked && chapter.link ? { to: chapter.link } : {}"
        class="block"
        :class="chapter.unlocked ? 'cursor-pointer' : ''"
      >
        <CardSurface
          class="flex items-start gap-4 p-4 transition-all duration-200"
          :class="
            chapter.unlocked
              ? 'border-[color:var(--color-border-strong)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(31,47,67,0.10)]'
              : 'bg-white/65 opacity-75'
          "
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[color:var(--color-secondary)] text-lg font-semibold text-[color:var(--color-primary)]">
            {{ chapter.order }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <p class="font-semibold text-[color:var(--color-foreground)]">{{ chapter.title }}</p>
              <PillBadge :tone="chapter.unlocked ? 'default' : 'warning'">
                {{ chapter.unlocked ? '可进入' : '待解锁' }}
              </PillBadge>
            </div>
            <p class="mt-1 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
              {{ chapter.summary }}
            </p>
          </div>
        </CardSurface>
      </component>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { buildHomePageState } from '@/app/pages/home-page.model'
import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import Button from '@/shared/ui/button/Button.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'
import ProgressMeter from '@/shared/ui/progress/ProgressMeter.vue'

const course = useCourseStore()
const progress = useProgressStore()

const pageState = computed(() => buildHomePageState(course.course?.chapters ?? [], progress.progress))
</script>
