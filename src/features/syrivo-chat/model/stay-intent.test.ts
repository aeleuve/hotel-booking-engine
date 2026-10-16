import { describe, expect, it } from 'vitest'
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
      children: 0,
      rooms: 1,
    })
  })

  it.each([
    ['unknown version', { ...detail, version: 2 }],
    ['missing version', { ...detail, version: undefined }],
    ['bad date', { ...detail, checkIn: '03/11/2026' }],
    ['string guests', { ...detail, adults: '2' }],
    ['zero rooms', { ...detail, rooms: 0 }],
    ['not an object', null],
  ])('rejects %s', (_name, value) => {
    expect(parseStayIntent(value)).toBeNull()
  })
})
