import type { CourseChapterSummary, LearningProgress } from '@/entities/content/model/types'

interface HomeHighlightedChapter extends CourseChapterSummary {
  unlocked: boolean
  link: string | null
}

function isChapterUnlocked(chapter: CourseChapterSummary, progress: LearningProgress) {
  if (!chapter.prerequisiteSlug) {
    return true
  }

  return Boolean(progress.chapterRecords[chapter.prerequisiteSlug]?.completed)
}

export function buildHomePageState(chapters: CourseChapterSummary[], progress: LearningProgress) {
  const totalChapters = chapters.length
  const chapterSlugs = new Set(chapters.map((chapter) => chapter.slug))
  const completedCount = Object.values(progress.chapterRecords).filter(
    (record) => chapterSlugs.has(record.chapterSlug) && record.completed,
  ).length
  const highlightedChapters: HomeHighlightedChapter[] = chapters.slice(0, 4).map((chapter) => {
    const unlocked = isChapterUnlocked(chapter, progress)

    return {
      ...chapter,
      unlocked,
      link: unlocked ? `/course/${chapter.slug}` : null,
    }
  })

  return {
    totalChapters,
    completedCount,
    progressRatio: totalChapters === 0 ? 0 : completedCount / totalChapters,
    highlightedChapters,
    continueLink: progress.currentChapterSlug ? `/course/${progress.currentChapterSlug}` : '/course',
    continueLabel: progress.currentChapterSlug ? '继续上次学习' : '从第一章开始',
  }
}
