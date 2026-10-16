import { describe, expect, it } from 'vitest'
import { localToday } from './date'

describe('localToday', () => {
  it('pads month and day', () => {
    expect(localToday(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
  })
})
