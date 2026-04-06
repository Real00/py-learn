/// <reference types="node" />

import { readFileSync } from 'fs'

import { describe, expect, it } from 'vitest'

describe('global link reset', () => {
  it('uses a zero-specificity selector so button link colors can override it', () => {
    const stylesheet = readFileSync('src/style.css', 'utf8')

    expect(stylesheet).toContain(':where(a) {')
    expect(stylesheet).not.toContain('\na {\n  color: inherit;')
  })
})
