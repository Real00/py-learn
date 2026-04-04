import { defineStore } from 'pinia'

import type { LearningProgress } from '@/entities/content/model/types'
import { createEmptyProgress, createRecord, isChapterUnlocked, loadProgress, saveProgress } from '@/features/progress/model/storage'

export const useProgressStore = defineStore('progress', {
  state: (): { progress: LearningProgress } => ({
    progress: createEmptyProgress(),
  }),
  getters: {
    records: (state) => state.progress.chapterRecords,
    completedCount: (state) => Object.values(state.progress.chapterRecords).filter((record) => record.completed).length,
    averageScore: (state) => {
      const completed = Object.values(state.progress.chapterRecords).filter((record) => record.completed)

      if (completed.length === 0) {
        return 0
      }

      return completed.reduce((sum, record) => sum + record.score, 0) / completed.length
    },
  },
  actions: {
    hydrate() {
      this.progress = loadProgress()
    },
    syncVersion(version: string) {
      if (this.progress.version === version) {
        return
      }

      this.progress = createEmptyProgress(version)
      saveProgress(this.progress)
    },
    markVisited(chapterSlug: string) {
      const existing = this.progress.chapterRecords[chapterSlug] ?? createRecord(chapterSlug)
      this.progress.chapterRecords[chapterSlug] = {
        ...existing,
        lastVisitedAt: new Date().toISOString(),
      }
      this.progress.currentChapterSlug = chapterSlug
      saveProgress(this.progress)
    },
    recordQuizResult(chapterSlug: string, score: number, answers: Record<string, string>) {
      const existing = this.progress.chapterRecords[chapterSlug] ?? createRecord(chapterSlug)
      this.progress.chapterRecords[chapterSlug] = {
        ...existing,
        completed: true,
        score,
        answers,
        lastVisitedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      }
      this.progress.currentChapterSlug = chapterSlug
      saveProgress(this.progress)
    },
    isUnlocked(chapterSlugs: string[], chapterSlug: string) {
      return isChapterUnlocked(chapterSlugs, this.progress.chapterRecords, chapterSlug)
    },
  },
})
