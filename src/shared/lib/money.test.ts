import { describe, expect, it } from 'vitest'
import { formatMoney } from './money'

describe('formatMoney', () => {
  it('drops decimals for whole amounts', () => {
    expect(formatMoney(89, 'EUR', 'en')).toBe('€89')
  })

  it('keeps cents otherwise', () => {
    expect(formatMoney(108.45, 'EUR', 'es')).toBe('108,45 €')
  })
})
