import { describe, expect, it } from 'vitest'
import { MAX_ADULTS, MAX_CHILDREN } from 'src/entities/hotel'
import { parseStayIntent } from './stay-intent'

const detail = {
  version: 1,
  checkIn: '2026-11-03',
  checkOut: '2026-11-05',
  adults: 2,
  children: 0,
  rooms: 1,
}

describe('parseStayIntent', () => {
  it('maps a v1 detail to a stay query', () => {
    expect(parseStayIntent({ ...detail, roomType: 'suite' })).toEqual({
      checkIn: '2026-11-03',
      checkOut: '2026-11-05',
      adults: 2,
      childrenAges: [],
      rooms: 1,
    })
  })

  it('keeps valid child ages and leaves missing ones to pick', () => {
    expect(parseStayIntent({ ...detail, children: 2, childrenAges: [4, 9] })?.childrenAges).toEqual(
      [4, 9],
    )
    expect(parseStayIntent({ ...detail, children: 2, childrenAges: [4] })?.childrenAges).toEqual([
      null,
      null,
    ])
    expect(parseStayIntent({ ...detail, children: 1 })?.childrenAges).toEqual([null])
  })

  it('accepts the booking form limits', () => {
    const limits = { ...detail, adults: MAX_ADULTS, children: MAX_CHILDREN, rooms: MAX_ADULTS }
    expect(parseStayIntent(limits)).toEqual({
      checkIn: '2026-11-03',
      checkOut: '2026-11-05',
      adults: MAX_ADULTS,
      childrenAges: Array.from({ length: MAX_CHILDREN }, () => null),
      rooms: MAX_ADULTS,
    })
  })

  it.each([
    ['unknown version', { ...detail, version: 2 }],
    ['missing version', { ...detail, version: undefined }],
    ['bad date', { ...detail, checkIn: '03/11/2026' }],
    ['string guests', { ...detail, adults: '2' }],
    ['zero rooms', { ...detail, rooms: 0 }],
    ['more adults than the booking form allows', { ...detail, adults: MAX_ADULTS + 1 }],
    ['more children than the booking form allows', { ...detail, children: MAX_CHILDREN + 1 }],
    ['more rooms than adults', { ...detail, adults: 2, rooms: 3 }],
    ['not an object', null],
  ])('rejects %s', (_name, value) => {
    expect(parseStayIntent(value)).toBeNull()
  })
})
