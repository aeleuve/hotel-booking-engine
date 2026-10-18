import { describe, expect, it, vi } from 'vitest'
import {
  HOTEL_REPOSITORY,
  useHotelStore,
  type Availability,
  type RateOffer,
  type StayQuery,
} from 'src/entities/hotel'
import { createFakeHotelRepository } from 'src/entities/hotel/model/fake-hotel-repository'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import { useFlexibleSearchStore, type FlexibleSearchRequest } from './flexible-search-store'

const today = '2026-10-18'

const weekendNovember: FlexibleSearchRequest = {
  stay: { month: '2026-11', nights: 2, checkInDay: 'friday' },
  guests: { adults: 2, childrenAges: [6], rooms: 1 },
}

const offer = (amount: number, extra: Partial<RateOffer> = {}): RateOffer => ({
  offerId: `o-${amount}`,
  roomId: 'std',
  name: 'Standard',
  board: { code: 'RO', name: 'Room only' },
  refundable: true,
  freeCancellationUntil: null,
  total: { amount, currency: 'EUR' },
  taxesIncluded: null,
  payAtHotel: null,
  ...extra,
})

const availabilityOf = (query: StayQuery, offers: RateOffer[]): Availability => ({
  query,
  nights: 2,
  offers,
})

const storeWith = (checkAvailability: (query: StayQuery) => Promise<Availability>) => {
  const fake = createFakeHotelRepository({ checkAvailability })
  setupPiniaWith(provision(HOTEL_REPOSITORY, fake))
  return useFlexibleSearchStore()
}

const prices: Record<string, number> = {
  '2026-11-06': 160,
  '2026-11-13': 120,
  '2026-11-20': 120,
  '2026-11-27': 200,
}

describe('flexible search store', () => {
  it('searches every range, at most 4 at a time, and picks the cheapest (earliest on a tie)', async () => {
    let inFlight = 0
    let maxInFlight = 0
    const checkAvailability = vi.fn(async (query: StayQuery) => {
      inFlight++
      maxInFlight = Math.max(maxInFlight, inFlight)
      await Promise.resolve()
      inFlight--
      return availabilityOf(query, [offer(prices[query.checkIn]!)])
    })
    const store = storeWith(checkAvailability)
    const best = await store.run(weekendNovember, today)
    expect(checkAvailability).toHaveBeenCalledTimes(4)
    expect(maxInFlight).toBeLessThanOrEqual(4)
    expect(best?.range).toEqual({ checkIn: '2026-11-13', checkOut: '2026-11-15' })
    expect(store.best).toEqual(best)
    expect(store.status).toBe('done')
    expect(store.done).toBe(4)
  })

  it('limits concurrency to 4 when there are more ranges', async () => {
    let inFlight = 0
    let maxInFlight = 0
    const checkAvailability = vi.fn(async (query: StayQuery) => {
      inFlight++
      maxInFlight = Math.max(maxInFlight, inFlight)
      await new Promise((resolve) => setTimeout(resolve, 1))
      inFlight--
      return availabilityOf(query, [offer(100)])
    })
    const store = storeWith(checkAvailability)
    await store.run(
      { ...weekendNovember, stay: { month: '2026-11', nights: 1, checkInDay: null } },
      today,
    )
    expect(checkAvailability.mock.calls.length).toBeGreaterThan(4)
    expect(maxInFlight).toBe(4)
  })

  it('passes the guests to every search', async () => {
    const checkAvailability = vi.fn(async (query: StayQuery) => availabilityOf(query, [offer(100)]))
    const store = storeWith(checkAvailability)
    await store.run(weekendNovember, today)
    const queries = checkAvailability.mock.calls.map(([query]) => query)
    expect(queries).toHaveLength(4)
    for (const query of queries) {
      expect(query).toMatchObject({ adults: 2, childrenAges: [6], rooms: 1 })
    }
  })

  it('marks a failed range and keeps the others competing', async () => {
    const store = storeWith(async (query) => {
      if (query.checkIn === '2026-11-13') throw new Error('offline')
      return availabilityOf(query, [offer(prices[query.checkIn]!)])
    })
    const best = await store.run(weekendNovember, today)
    const failed = store.entries.find((entry) => entry.range.checkIn === '2026-11-13')
    expect(failed).toMatchObject({ state: 'failed', price: null })
    expect(best?.range.checkIn).toBe('2026-11-20')
    expect(store.status).toBe('done')
    expect(store.done).toBe(4)
  })

  it('reports an error when every range fails', async () => {
    const store = storeWith(() => Promise.reject(new Error('offline')))
    const best = await store.run(weekendNovember, today)
    expect(best).toBeNull()
    expect(store.best).toBeNull()
    expect(store.status).toBe('error')
    expect(store.entries.every((entry) => entry.state === 'failed')).toBe(true)
  })

  it('marks ranges without matching offers as unavailable', async () => {
    const store = storeWith(async (query) =>
      availabilityOf(query, query.checkIn === '2026-11-06' ? [] : [offer(prices[query.checkIn]!)]),
    )
    await store.run(weekendNovember, today)
    const entry = store.entries.find((item) => item.range.checkIn === '2026-11-06')
    expect(entry).toMatchObject({ state: 'unavailable', price: null })
    expect(store.best?.range.checkIn).toBe('2026-11-13')
    expect(store.status).toBe('done')
  })

  it('finishes done, with no best, when every range is unavailable', async () => {
    const store = storeWith(async (query) => availabilityOf(query, []))
    const best = await store.run(weekendNovember, today)
    expect(best).toBeNull()
    expect(store.status).toBe('done')
  })

  it('filters offers by the requested room type', async () => {
    const store = storeWith(async (query) =>
      availabilityOf(query, [
        offer(100),
        offer(300, { offerId: 'su', roomId: 'su', name: 'Suite offer' }),
      ]),
    )
    useHotelStore().rooms = [
      { id: 'su', name: 'Suite', sizeM2: null, maxGuests: 2, beds: [], photoUrls: [] },
    ]
    const best = await store.run({ ...weekendNovember, roomType: 'suite' }, today)
    expect(best?.price).toEqual({ amount: 300, currency: 'EUR' })
  })

  it('drops the results of a search replaced by a newer one', async () => {
    const pending: { query: StayQuery; resolve: (value: Availability) => void }[] = []
    const store = storeWith((query) => new Promise((resolve) => pending.push({ query, resolve })))
    const first = store.run(weekendNovember, today)
    await Promise.resolve()
    expect(pending).toHaveLength(4)
    const firstCalls = pending.splice(0)

    const second = store.run(weekendNovember, today)
    await Promise.resolve()
    expect(pending).toHaveLength(4)
    const secondCalls = pending.splice(0)

    // The second run resolves first, the first run's results arrive late.
    for (const { query, resolve } of secondCalls) resolve(availabilityOf(query, [offer(500)]))
    await second
    for (const { query, resolve } of firstCalls) resolve(availabilityOf(query, [offer(1)]))
    await first

    expect(store.entries).toHaveLength(4)
    expect(store.entries.every((entry) => entry.price?.amount === 500)).toBe(true)
    expect(store.done).toBe(4)
    expect(store.status).toBe('done')
    expect(store.best?.price?.amount).toBe(500)
  })

  it('does not let a replaced run overwrite the newer run while it is still searching', async () => {
    const pending: { query: StayQuery; resolve: (value: Availability) => void }[] = []
    const store = storeWith((query) => new Promise((resolve) => pending.push({ query, resolve })))
    const first = store.run(weekendNovember, today)
    await Promise.resolve()
    const firstCalls = pending.splice(0)
    const second = store.run(weekendNovember, today)
    await Promise.resolve()
    const secondCalls = pending.splice(0)

    for (const { query, resolve } of firstCalls) resolve(availabilityOf(query, [offer(1)]))
    await first
    expect(store.status).toBe('searching')
    expect(store.done).toBe(0)
    expect(store.entries.every((entry) => entry.state === 'pending')).toBe(true)

    for (const { query, resolve } of secondCalls) resolve(availabilityOf(query, [offer(500)]))
    await second
    expect(store.done).toBe(4)
  })

  it('rejectGuests shows the too-many-guests state without searching', () => {
    const checkAvailability = vi.fn(async (query: StayQuery) => availabilityOf(query, []))
    const store = storeWith(checkAvailability)
    store.rejectGuests()
    expect(store.status).toBe('too-many-guests')
    expect(store.entries).toEqual([])
    expect(checkAvailability).not.toHaveBeenCalled()
  })

  it('clear resets the store', async () => {
    const store = storeWith(async (query) => availabilityOf(query, [offer(100)]))
    await store.run(weekendNovember, today)
    store.clear()
    expect(store).toMatchObject({ status: 'idle', request: null, entries: [], done: 0 })
  })
})
