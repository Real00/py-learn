import type { ChapterDetail } from '@/entities/content/model/types'

export function buildChapterPageState(chapter: ChapterDetail) {
  return {
    hero: {
      title: chapter.title,
      summary: chapter.summary,
      estimatedMinutes: chapter.estimatedMinutes,
      difficultyLabel: chapter.difficultyLabel,
      tags: chapter.tags,
    },
    lessonBlocks: chapter.sections,
    practiceTasks: chapter.practiceTasks ?? [],
    reviewChecklist: chapter.reviewChecklist ?? [],
    summaryPoints: chapter.summaryPoints,
  }
}
