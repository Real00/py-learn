import { beforeEach, describe, expect, it } from 'vitest'

import { createEmptyProgress, createRecord, isChapterUnlocked, loadProgress, PROGRESS_STORAGE_KEY, saveProgress } from '@/features/progress/model/storage'

describe('progress storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('saves and reloads progress', () => {
    const progress = createEmptyProgress('v1')
    progress.currentChapterSlug = 'variables'
    progress.chapterRecords.variables = createRecord('variables')

    saveProgress(progress)

    expect(loadProgress()).toEqual(progress)
  })

  it('falls back to an empty state when storage is invalid', () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, 'not-json')

    expect(loadProgress()).toEqual(createEmptyProgress())
  })

  it('unlocks a chapter when the previous chapter is completed', () => {
    const records = {
      intro: {
        ...createRecord('intro'),
        completed: true,
      },
    }

    expect(isChapterUnlocked(['intro', 'variables'], records, 'intro')).toBe(true)
    expect(isChapterUnlocked(['intro', 'variables'], records, 'variables')).toBe(true)
  })
})
