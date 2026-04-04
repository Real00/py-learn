import type { CourseChapterSummary, LearningProgress } from '@/entities/content/model/types'

export function buildHomePageState(chapters: CourseChapterSummary[], progress: LearningProgress) {
  const totalChapters = chapters.length
  const completedCount = Object.values(progress.chapterRecords).filter((record) => record.completed).length

  return {
    totalChapters,
    completedCount,
    progressRatio: totalChapters === 0 ? 0 : completedCount / totalChapters,
    highlightedChapters: chapters.slice(0, 4),
    continueLink: progress.currentChapterSlug ? `/course/${progress.currentChapterSlug}` : '/course',
    continueLabel: progress.currentChapterSlug ? '继续上次学习' : '从第一章开始',
  }
}
