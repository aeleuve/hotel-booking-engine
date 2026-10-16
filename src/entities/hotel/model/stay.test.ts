import { describe, expect, it } from 'vitest'
import { addDays, countNights, defaultStay, validateStay } from './stay'

const today = '2026-10-15'

describe('stay', () => {
  it('adds days across month ends', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
  })

  it('counts nights between dates', () => {
    expect(countNights({ checkIn: '2026-10-15', checkOut: '2026-10-18' })).toBe(3)
  })

  it('defaults to one night for two adults', () => {
    expect(defaultStay(today)).toEqual({
      checkIn: today,
      checkOut: '2026-10-16',
      adults: 2,
      children: 0,
      rooms: 1,
    })
  })

  it.each([
    [{ checkIn: '2026-10-14', checkOut: '2026-10-16' }, 'check-in-past'],
    [{ checkIn: '2026-10-16', checkOut: '2026-10-16' }, 'check-out-before-check-in'],
    [{ checkIn: '2026-10-16', checkOut: '2026-12-01' }, 'too-many-nights'],
    [{ adults: 0 }, 'no-adults'],
  ])('rejects %o with %s', (patch, error) => {
    expect(validateStay({ ...defaultStay(today), ...patch }, today)).toBe(error)
  })

  it('accepts a valid stay', () => {
    expect(validateStay(defaultStay(today), today)).toBeNull()
  })
})
