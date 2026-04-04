import { describe, expect, it } from 'vitest'

import { buttonVariants } from '@/shared/ui/button/button'

describe('button variants', () => {
  it('builds secondary button classes', () => {
    expect(buttonVariants({ variant: 'secondary' })).toContain('border')
  })
})
