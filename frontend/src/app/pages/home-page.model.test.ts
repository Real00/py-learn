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

  it('marks unlocked highlighted chapters with direct links', () => {
    const state = buildHomePageState(
      [
        {
          slug: 'python-overview',
          order: 1,
          title: 'Python 到底是什么',
          summary: '认识 Python 是什么',
          estimatedMinutes: 18,
          difficultyLabel: '轻松入门',
          prerequisiteSlug: null,
          tags: ['认识 Python'],
        },
        {
          slug: 'variables-and-types',
          order: 2,
          title: '变量和数据类型',
          summary: '学会保存数据',
          estimatedMinutes: 20,
          difficultyLabel: '逐步上手',
          prerequisiteSlug: 'python-overview',
          tags: ['变量'],
        },
      ],
      {
        version: '1.1.0',
        currentChapterSlug: 'variables-and-types',
        chapterRecords: {
          'python-overview': {
            chapterSlug: 'python-overview',
            completed: true,
            score: 100,
            answers: {},
            lastVisitedAt: '2026-04-05T09:00:00.000Z',
            completedAt: '2026-04-05T09:05:00.000Z',
          },
        },
      },
    )

    expect(state.highlightedChapters[0]).toMatchObject({
      slug: 'python-overview',
      unlocked: true,
      link: '/course/python-overview',
    })
    expect(state.highlightedChapters[1]).toMatchObject({
      slug: 'variables-and-types',
      unlocked: true,
      link: '/course/variables-and-types',
    })
  })

  it('keeps locked highlighted chapters non-clickable', () => {
    const state = buildHomePageState(
      [
        {
          slug: 'python-overview',
          order: 1,
          title: 'Python 到底是什么',
          summary: '认识 Python 是什么',
          estimatedMinutes: 18,
          difficultyLabel: '轻松入门',
          prerequisiteSlug: null,
          tags: ['认识 Python'],
        },
        {
          slug: 'variables-and-types',
          order: 2,
          title: '变量和数据类型',
          summary: '学会保存数据',
          estimatedMinutes: 20,
          difficultyLabel: '逐步上手',
          prerequisiteSlug: 'python-overview',
          tags: ['变量'],
        },
      ],
      {
        version: '1.1.0',
        currentChapterSlug: null,
        chapterRecords: {},
      },
    )

    expect(state.highlightedChapters[1]).toMatchObject({
      unlocked: false,
      link: null,
    })
  })

  it('counts only completed records that belong to the current course list', () => {
    const state = buildHomePageState(
      [
        {
          slug: 'python-overview',
          order: 1,
          title: 'Python 到底是什么',
          summary: '认识 Python 是什么',
          estimatedMinutes: 18,
          difficultyLabel: '轻松入门',
          prerequisiteSlug: null,
          tags: ['认识 Python'],
        },
      ],
      {
        version: '1.1.0',
        currentChapterSlug: 'python-overview',
        chapterRecords: {
          'python-overview': {
            chapterSlug: 'python-overview',
            completed: true,
            score: 100,
            answers: {},
            lastVisitedAt: '2026-04-05T09:00:00.000Z',
            completedAt: '2026-04-05T09:05:00.000Z',
          },
          legacy: {
            chapterSlug: 'legacy',
            completed: true,
            score: 100,
            answers: {},
            lastVisitedAt: '2026-04-05T09:00:00.000Z',
            completedAt: '2026-04-05T09:05:00.000Z',
          },
        },
      },
    )

    expect(state.completedCount).toBe(1)
    expect(state.progressRatio).toBe(1)
  })
})
