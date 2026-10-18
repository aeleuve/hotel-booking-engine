import { describe, expect, it } from 'vitest'
import { HOTEL_REPOSITORY, type Availability, type StayQuery } from 'src/entities/hotel'
import { createFakeHotelRepository } from 'src/entities/hotel/model/fake-hotel-repository'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import { useAvailabilityStore } from './availability-store'

const today = '2026-10-15'

const storeWith = (checkAvailability?: (query: StayQuery) => Promise<Availability>) => {
  const fake = createFakeHotelRepository(checkAvailability ? { checkAvailability } : {})
  setupPiniaWith(provision(HOTEL_REPOSITORY, fake))
  const store = useAvailabilityStore()
  store.reset(today)
  return store
}

describe('availability store', () => {
  it('stores prices for a valid stay', async () => {
    const store = storeWith()
    await store.search(today)
    expect(store.status).toBe('done')
    expect(store.result?.offers).toHaveLength(1)
  })

  it('rejects an invalid stay without calling the repository', async () => {
    const store = storeWith(() => Promise.reject(new Error('should not run')))
    store.query.checkOut = store.query.checkIn
    await store.search(today)
    expect(store.status).toBe('invalid')
    expect(store.error).toBe('check-out-before-check-in')
  })

  it('reports network failures', async () => {
    const store = storeWith(() => Promise.reject(new Error('offline')))
    await store.search(today)
    expect(store.status).toBe('error')
    expect(store.error).toBe('network')
  })

  it('keeps only the latest search result', async () => {
    const resolvers: ((value: Availability) => void)[] = []
    const store = storeWith(() => new Promise((resolve) => resolvers.push(resolve)))
    const first = store.search(today)
    const second = store.search(today)
    const latest = { query: store.query, nights: 2, offers: [] }
    resolvers[1]!(latest)
    resolvers[0]!({ ...latest, nights: 9 })
    await Promise.all([first, second])
    expect(store.result?.nights).toBe(2)
  })
})
