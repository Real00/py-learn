import { describe, expect, it } from 'vitest'

import { buildHomePageState } from '@/app/pages/home-page.model'

describe('buildHomePageState', () => {
  it('prefers the current chapter for the continue CTA', () => {
    const state = buildHomePageState(
      [
        {
          slug: 'intro',
          order: 1,
          title: 'Intro',
          summary: '从零开始认识编程',
          estimatedMinutes: 10,
          difficultyLabel: '轻松',
          prerequisiteSlug: null,
          tags: [],
        },
      ],
      { currentChapterSlug: 'intro', chapterRecords: {}, version: 'v1' },
    )

    expect(state.continueLabel).toBe('继续上次学习')
    expect(state.continueLink).toBe('/course/intro')
  })
})
