<template>
  <div v-if="chapter" class="space-y-4">
    <CardSurface class="p-6">
      <PillBadge tone="success">章节复习</PillBadge>
      <h1 class="mt-4 text-3xl font-semibold text-[color:var(--color-foreground)]">
        {{ chapter.title }} 复习题
      </h1>
      <p class="mt-3 text-sm leading-7 text-[color:var(--color-secondary-foreground)]">
        先自己想，再提交。错题会直接告诉你原因，不需要猜。
      </p>
    </CardSurface>

    <QuizQuestionCard
      v-for="question in chapter.quiz"
      :key="question.id"
      v-model="answers[question.id]"
      :question="question"
      :show-result="submitted"
      :is-correct="result?.correctnessById[question.id]"
    />

    <CardSurface class="p-5">
      <Button class="w-full" :disabled="!isQuizComplete" @click="submitQuiz">
        {{ submitted ? '重新计算结果' : '提交答案' }}
      </Button>

      <p v-if="!isQuizComplete" class="mt-3 text-sm text-[color:var(--color-warning)]">
        还有题目没完成，先把所有答案填完再提交。
      </p>

      <div v-if="result" class="mt-4 rounded-[22px] bg-[color:var(--color-secondary)] p-4">
        <p class="text-lg font-bold text-[color:var(--color-foreground)]">
          你答对了 {{ result.correctCount }}/{{ result.totalCount }} 题，得分 {{ result.score }}
        </p>
        <p class="mt-2 text-sm leading-6 text-[color:var(--color-secondary-foreground)]">
          {{ scoreHint }}
        </p>

        <div class="mt-4 flex gap-3">
          <Button as="a" :href="nextChapterLink" class="flex-1">
            {{ nextChapterLabel }}
          </Button>
          <Button as="a" :href="`/course/${chapter.slug}`" variant="secondary" class="flex-1">
            回看本章
          </Button>
        </div>
      </div>
    </CardSurface>
  </div>

  <CardSurface v-else class="p-6">
    <p class="text-sm text-[color:var(--color-secondary-foreground)]">复习题加载中...</p>
  </CardSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import QuizQuestionCard from '@/components/course/QuizQuestionCard.vue'
import { evaluateQuiz, type QuizResult } from '@/features/course/model/quiz'
import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'
import PillBadge from '@/shared/ui/badge/PillBadge.vue'
import Button from '@/shared/ui/button/Button.vue'
import CardSurface from '@/shared/ui/card/CardSurface.vue'

const route = useRoute()
const course = useCourseStore()
const progress = useProgressStore()

const submitted = ref(false)
const result = ref<QuizResult | null>(null)
const answers = reactive<Record<string, string>>({})

const slug = computed(() => String(route.params.slug))
const chapter = computed(() => course.chapters[slug.value] ?? null)
const orderedChapters = computed(() => course.course?.chapters ?? [])
const currentChapterIndex = computed(() => orderedChapters.value.findIndex((item) => item.slug === slug.value))
const nextChapter = computed(() => orderedChapters.value[currentChapterIndex.value + 1] ?? null)
const nextChapterLink = computed(() => (nextChapter.value ? `/course/${nextChapter.value.slug}` : '/progress'))
const nextChapterLabel = computed(() => (nextChapter.value ? '进入下一章' : '查看学习进度'))
const isQuizComplete = computed(() => {
  if (!chapter.value) {
    return false
  }

  return chapter.value.quiz.every((question) => String(answers[question.id] ?? '').trim().length > 0)
})

const scoreHint = computed(() => {
  if (!result.value) {
    return ''
  }

  if (result.value.score >= 80) {
    return '这一章你已经掌握得不错了，可以继续往下学。'
  }

  if (result.value.score >= 60) {
    return '基础已经有了，建议先回看错题解释，再进入下一章。'
  }

  return '先别急着往后走，把本章讲解再看一遍会更稳。'
})

onMounted(async () => {
  await course.ensureChapterLoaded(slug.value)
  progress.markVisited(slug.value)
})

function submitQuiz() {
  if (!chapter.value || !isQuizComplete.value) {
    return
  }

  submitted.value = true
  result.value = evaluateQuiz(chapter.value.quiz, answers)
  progress.recordQuizResult(chapter.value.slug, result.value.score, { ...answers })
}
</script>
