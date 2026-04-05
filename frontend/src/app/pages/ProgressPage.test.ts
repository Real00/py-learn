import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import ProgressPage from '@/app/pages/ProgressPage.vue'
import { useCourseStore } from '@/features/course/model/course-store'
import { useProgressStore } from '@/features/progress/model/progress-store'

describe('ProgressPage', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const course = useCourseStore()
    course.course = {
      slug: 'python-starter',
      title: 'Python 入门',
      subtitle: '从零开始',
      description: '测试课程',
      version: '1.1.0',
      chapters: [
        {
          slug: 'python-overview',
          order: 1,
          title: 'Python 到底是什么',
          summary: '认识 Python',
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
    }

    const progress = useProgressStore()
    progress.progress = {
      version: '1.1.0',
      currentChapterSlug: 'python-overview',
      chapterRecords: {
        'python-overview': {
          chapterSlug: 'python-overview',
          completed: false,
          score: 0,
          answers: {},
          lastVisitedAt: '2026-04-05T09:00:00.000Z',
          completedAt: null,
        },
      },
    }
  })

  it('shows not-started state for chapters without a record', () => {
    const wrapper = mount(ProgressPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('进行中')
    expect(wrapper.text()).toContain('未开始')
  })
})
