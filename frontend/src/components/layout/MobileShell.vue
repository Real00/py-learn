<template>
  <div class="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
    <header class="mb-4 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[color:var(--color-primary)] text-lg font-black text-white shadow-[var(--shadow-soft)]">
          Py
        </div>
        <div>
          <p class="text-sm font-bold text-[color:var(--color-foreground)]">Python Starter</p>
          <p class="text-xs text-[color:var(--color-muted-foreground)]">一步一步学 Python</p>
        </div>
      </RouterLink>

      <RouterLink
        v-if="progress.progress.currentChapterSlug"
        :to="`/course/${progress.progress.currentChapterSlug}`"
        class="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[color:var(--color-secondary-foreground)] ring-1 ring-[color:var(--color-border)] transition-colors hover:bg-white"
      >
        继续学习
      </RouterLink>
    </header>

    <main>
      <RouterView />
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import BottomNav from '@/components/layout/BottomNav.vue'
import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'

const course = useCourseStore()
const progress = useProgressStore()

onMounted(async () => {
  progress.hydrate()
  await course.ensureCourseLoaded()
})

watch(
  () => course.course?.version,
  (version) => {
    if (version) {
      progress.syncVersion(version)
    }
  },
  { immediate: true },
)
</script>
