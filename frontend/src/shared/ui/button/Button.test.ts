import { describe, expect, it } from 'vitest'

import { buttonVariants } from '@/shared/ui/button/button'

describe('button variants', () => {
  it('builds primary button classes with enforced white foreground', () => {
    const classes = buttonVariants({ variant: 'primary' })

    expect(classes).toContain('bg-[color:var(--color-primary)]')
    expect(classes).toContain('!text-[color:var(--color-primary-foreground)]')
    expect(classes).toContain('[&_*]:!text-[color:var(--color-primary-foreground)]')
  })

  it('builds secondary button classes', () => {
    expect(buttonVariants({ variant: 'secondary' })).toContain('border')
  })
})
