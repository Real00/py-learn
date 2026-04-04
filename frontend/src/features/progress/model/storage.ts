import type { LearningProgress, LearningRecord } from '@/entities/content/model/types'

export const PROGRESS_STORAGE_KEY = 'python_starter_progress_v1'

export function createEmptyProgress(version = 'draft'): LearningProgress {
  return {
    version,
    currentChapterSlug: null,
    chapterRecords: {},
  }
}

export function loadProgress(): LearningProgress {
  if (typeof window === 'undefined') {
    return createEmptyProgress()
  }

  const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY)

  if (!raw) {
    return createEmptyProgress()
  }

  try {
    const parsed = JSON.parse(raw) as LearningProgress
    return {
      version: parsed.version ?? 'draft',
      currentChapterSlug: parsed.currentChapterSlug ?? null,
      chapterRecords: parsed.chapterRecords ?? {},
    }
  } catch {
    return createEmptyProgress()
  }
}

export function saveProgress(progress: LearningProgress) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
}

export function createRecord(chapterSlug: string): LearningRecord {
  return {
    chapterSlug,
    completed: false,
    score: 0,
    answers: {},
    lastVisitedAt: new Date().toISOString(),
    completedAt: null,
  }
}

export function isChapterUnlocked(
  orderedChapterSlugs: string[],
  records: Record<string, LearningRecord>,
  slug: string,
) {
  const chapterIndex = orderedChapterSlugs.indexOf(slug)

  if (chapterIndex <= 0) {
    return chapterIndex === 0
  }

  const previousSlug = orderedChapterSlugs[chapterIndex - 1]
  return Boolean(records[previousSlug]?.completed)
}
