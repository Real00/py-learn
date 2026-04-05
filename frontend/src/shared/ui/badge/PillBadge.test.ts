import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PillBadge from '@/shared/ui/badge/PillBadge.vue'

describe('PillBadge', () => {
  it('keeps badges on a single line', () => {
    const wrapper = mount(PillBadge, {
      props: { tone: 'warning' },
      slots: { default: '进行中' },
    })

    expect(wrapper.classes()).toContain('whitespace-nowrap')
    expect(wrapper.classes()).toContain('shrink-0')
  })
})
