import { describe, expect, it } from 'vitest'

import { buildChapterPageState } from '@/app/pages/chapter-page.model'

describe('buildChapterPageState', () => {
  it('splits chapter detail into lesson, practice, and review surfaces', () => {
    const state = buildChapterPageState({
      slug: 'python-overview',
      order: 1,
      title: 'Python 到底是什么',
      summary: '先认识 Python 是做什么的。',
      estimatedMinutes: 18,
      difficultyLabel: '轻松入门',
      prerequisiteSlug: null,
      tags: ['认识 Python'],
      learningGoals: ['知道 Python 是编程语言'],
      summaryPoints: ['Python 是编程语言'],
      sections: [{ id: 's1', type: 'concept', title: '概念', content: '编程语言是告诉电脑做事的规则。' }],
      practiceTasks: [{ id: 'p1', title: '练习', prompt: '用自己的话解释 Python 是什么。', hints: ['先说它是不是软件'], expectedOutcome: '能说出 Python 是编程语言。' }],
      reviewChecklist: [{ id: 'r1', text: '我能解释 Python 的作用。' }],
      quiz: [],
    })

    expect(state.lessonBlocks).toHaveLength(1)
    expect(state.practiceTasks).toHaveLength(1)
    expect(state.reviewChecklist).toHaveLength(1)
  })
})
