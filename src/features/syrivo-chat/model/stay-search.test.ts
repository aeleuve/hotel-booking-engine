import { describe, expect, it } from 'vitest'
import { MAX_ADULTS } from 'src/entities/hotel'
import { parseStaySearch } from './stay-search'

const detail = {
  version: 1,
  month: '2026-11',
  nights: 2,
  checkInDay: 'friday',
  adults: 2,
  children: 1,
  childrenAges: [6],
  rooms: 1,
  roomType: 'suite',
}

describe('parseStaySearch', () => {
  it('maps a v1 detail to a flexible stay and guests', () => {
    expect(parseStaySearch(detail)).toEqual({
      ok: true,
      request: {
        stay: { month: '2026-11', nights: 2, checkInDay: 'friday' },
        guests: { adults: 2, childrenAges: [6], rooms: 1 },
        roomType: 'suite',
      },
    })
  })

  it('flags guests the booking form cannot search as too many', () => {
    expect(parseStaySearch({ ...detail, adults: MAX_ADULTS + 1 })).toEqual({
      ok: false,
      reason: 'too-many-guests',
    })
  })

  it.each([
    ['another version', { ...detail, version: 2 }],
    ['a bad month', { ...detail, month: 'November' }],
    ['15 nights', { ...detail, nights: 15 }],
    ['an unknown weekday', { ...detail, checkInDay: 'monday' }],
    ['ages that do not match children', { ...detail, childrenAges: [] }],
    ['more rooms than adults', { ...detail, rooms: 3 }],
    ['not an object', 'November'],
  ])('rejects %s as malformed', (_name, value) => {
    expect(parseStaySearch(value)).toEqual({ ok: false, reason: 'malformed' })
  })
})
