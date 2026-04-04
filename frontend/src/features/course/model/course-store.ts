import { defineStore } from 'pinia'

import { fetchChapterDetail, fetchCourseOverview } from '@/entities/content/api/courseApi'
import type { ChapterDetail, CourseOverview } from '@/entities/content/model/types'

interface CourseState {
  course: CourseOverview | null
  chapters: Record<string, ChapterDetail>
  loading: boolean
  error: string | null
}

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    course: null,
    chapters: {},
    loading: false,
    error: null,
  }),
  getters: {
    orderedChapterSlugs: (state) => state.course?.chapters.map((chapter) => chapter.slug) ?? [],
  },
  actions: {
    async ensureCourseLoaded() {
      if (this.course || this.loading) {
        return
      }

      this.loading = true
      this.error = null

      try {
        this.course = await fetchCourseOverview()
      } catch (error) {
        this.error = error instanceof Error ? error.message : '课程加载失败'
      } finally {
        this.loading = false
      }
    },
    async ensureChapterLoaded(slug: string) {
      if (this.chapters[slug]) {
        return this.chapters[slug]
      }

      const chapter = await fetchChapterDetail(slug)
      this.chapters[slug] = chapter
      return chapter
    },
  },
})
