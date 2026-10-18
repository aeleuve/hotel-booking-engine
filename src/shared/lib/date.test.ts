import { describe, expect, it } from 'vitest'
import { formatWeekday, localToday } from './date'

describe('localToday', () => {
  it('pads month and day', () => {
    expect(localToday(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
  })
})

describe('formatWeekday', () => {
  it('names the short weekday of a calendar day in the given locale', () => {
    expect(formatWeekday('2026-11-06', 'en')).toBe('Fri')
    expect(formatWeekday('2026-11-08', 'es')).toBe('dom')
  })
})
