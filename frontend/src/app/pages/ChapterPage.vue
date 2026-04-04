<template>
  <div v-if="chapter && pageState" class="space-y-4">
    <ChapterHero :hero="pageState.hero" />
    <LearningGoalsCard :goals="chapter.learningGoals" />

    <LessonBlock
      v-for="section in pageState.lessonBlocks"
      :key="section.id"
      :section="section"
    />

    <PracticeTaskCard
      v-for="task in pageState.practiceTasks"
      :key="task.id"
      :task="task"
    />

    <CardSurface class="p-5">
      <h2 class="text-xl font-semibold text-[color:var(--color-foreground)]">
        本章小结
      </h2>
      <ul class="mt-4 space-y-2 pl-5 text-sm leading-6 text-[color:var(--color-secondary-foreground)]">
        <li v-for="point in pageState.summaryPoints" :key="point" class="list-disc">{{ point }}</li>
      </ul>
    </CardSurface>

    <ReviewChecklistCard v-if="pageState.reviewChecklist.length" :items="pageState.reviewChecklist" />

    <CardSurface class="p-5">
      <div class="flex gap-3">
        <Button as="a" :href="`/review/${chapter.slug}`" class="flex-1">
          进入本章测验
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

import { buildChapterPageState } from '@/app/pages/chapter-page.model'
import ChapterHero from '@/components/course/ChapterHero.vue'
import LearningGoalsCard from '@/components/course/LearningGoalsCard.vue'
import LessonBlock from '@/components/course/LessonBlock.vue'
import PracticeTaskCard from '@/components/course/PracticeTaskCard.vue'
import ReviewChecklistCard from '@/components/course/ReviewChecklistCard.vue'
import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'
import Button from '@/shared/ui/button/Button.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const route = useRoute()
const course = useCourseStore()
const progress = useProgressStore()

const slug = computed(() => String(route.params.slug))
const chapter = computed(() => course.chapters[slug.value] ?? null)
const pageState = computed(() => (chapter.value ? buildChapterPageState(chapter.value) : null))

onMounted(async () => {
  await course.ensureChapterLoaded(slug.value)
  progress.markVisited(slug.value)
})
</script>
