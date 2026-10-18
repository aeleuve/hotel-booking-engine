import { describe, expect, it } from 'vitest'
import { canCancelFree, emailsMatch } from './cancellation'
import { fakeBooking } from './fake-booking-repository'

const now = new Date('2026-11-01T00:00:00Z')

describe('cancellation rules', () => {
  it('allows free cancellation before the deadline', () => {
    expect(canCancelFree(fakeBooking, now)).toBe(true)
  })

  it.each([
    [{ freeCancellationUntil: '2026-10-31T23:00:00Z' }],
    [{ refundable: false }],
    [{ status: 'cancelled' as const }],
  ])('refuses %o', (patch) => {
    expect(canCancelFree({ ...fakeBooking, ...patch }, now)).toBe(false)
  })

  it('compares emails case-insensitively', () => {
    expect(emailsMatch(' Ana@Example.test', 'ana@example.test ')).toBe(true)
  })
})
