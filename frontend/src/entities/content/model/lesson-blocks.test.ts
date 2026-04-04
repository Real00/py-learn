import { describe, expect, it } from 'vitest'

import { getLessonBlockMeta } from '@/entities/content/model/lesson-blocks'

describe('lesson block meta', () => {
  it('maps concept blocks to a readable label', () => {
    expect(getLessonBlockMeta('concept')).toEqual({
      label: '核心概念',
      tone: 'primary',
    })
  })

  it('maps pitfall blocks to a warning tone', () => {
    expect(getLessonBlockMeta('pitfall')).toEqual({
      label: '常见误区',
      tone: 'warning',
    })
  })
})
