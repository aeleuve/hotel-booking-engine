import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import {
  HOTEL_REPOSITORY,
  MAX_ADULTS,
  type Availability,
  type HotelRepository,
  type StayQuery,
} from 'src/entities/hotel'
import { useAvailabilityStore } from 'src/features/check-availability'
import { useFlexibleSearchStore } from 'src/features/flexible-search'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import SyrivoChatBridge from './SyrivoChatBridge.vue'

// Vue's `provide` map is typed with string keys; the injection key is a symbol.

const stay = {
  version: 1,
  checkIn: '2099-11-03',
  checkOut: '2099-11-05',
  adults: 2,
  children: 1,
  childrenAges: [7],
  rooms: 1,
}

const search = {
  version: 1,
  month: '2099-11',
  nights: 2,
  checkInDay: 'friday',
  adults: 2,
  children: 1,
  childrenAges: [6],
  rooms: 1,
}

const prices: Record<string, number> = {
  '2099-11-06': 160,
  '2099-11-13': 120,
  '2099-11-20': 140,
  '2099-11-27': 200,
}

const offerAt = (amount: number) => ({
  offerId: `o-${amount}`,
  roomId: 'std',
  name: 'Standard',
  board: { code: 'RO', name: 'Room only' },
  refundable: true,
  freeCancellationUntil: null,
  total: { amount, currency: 'EUR' },
  taxesIncluded: null,
  payAtHotel: null,
})

const mountBridge = (checkAvailability: ReturnType<typeof vi.fn>) => {
  const repository = { checkAvailability } as unknown as HotelRepository
  const { pinia } = setupPiniaWith(provision(HOTEL_REPOSITORY, repository))
  return mount(SyrivoChatBridge, {
    global: { plugins: [pinia], provide: { [HOTEL_REPOSITORY as symbol]: repository } },
  })
}

const priced = (query: StayQuery): Availability => ({
  query,
  nights: 2,
  offers: [offerAt(prices[query.checkIn] ?? 999)],
})

describe('SyrivoChatBridge', () => {
  it('fills the search and runs it when the widget sends a stay intent', async () => {
    const checkAvailability = vi.fn().mockResolvedValue({ query: stay, nights: 2, offers: [] })
    const repository = { checkAvailability } as unknown as HotelRepository
    const { pinia } = setupPiniaWith(provision(HOTEL_REPOSITORY, repository))
    const wrapper = mount(SyrivoChatBridge, {
      global: { plugins: [pinia], provide: { [HOTEL_REPOSITORY as symbol]: repository } },
    })
    document.dispatchEvent(new CustomEvent('syrivo:stay-intent', { detail: stay }))
    await vi.waitFor(() => expect(checkAvailability).toHaveBeenCalledOnce())
    expect(useAvailabilityStore().query).toEqual({
      checkIn: '2099-11-03',
      checkOut: '2099-11-05',
      adults: 2,
      childrenAges: [7],
      rooms: 1,
    })
    wrapper.unmount()
  })

  it('ignores malformed details and stops listening after unmount', async () => {
    const checkAvailability = vi.fn()
    const repository = { checkAvailability } as unknown as HotelRepository
    const { pinia } = setupPiniaWith(provision(HOTEL_REPOSITORY, repository))
    const wrapper = mount(SyrivoChatBridge, {
      global: { plugins: [pinia], provide: { [HOTEL_REPOSITORY as symbol]: repository } },
    })
    const store = useAvailabilityStore()
    const queryBefore = { ...store.query }
    for (const detail of [
      { ...stay, version: 9 },
      { ...stay, adults: 0 },
      { ...stay, rooms: 3 },
      { ...stay, checkIn: 'tomorrow' },
      'not an object',
      null,
    ]) {
      document.dispatchEvent(new CustomEvent('syrivo:stay-intent', { detail }))
    }
    await Promise.resolve()
    expect(store.query).toEqual(queryBefore)
    expect(store.status).toBe('idle')
    wrapper.unmount()
    document.dispatchEvent(new CustomEvent('syrivo:stay-intent', { detail: stay }))
    await Promise.resolve()
    expect(checkAvailability).not.toHaveBeenCalled()
  })

  it('runs the month search, then loads and searches the cheapest range', async () => {
    const checkAvailability = vi.fn(async (query: StayQuery) => priced(query))
    const wrapper = mountBridge(checkAvailability)
    document.dispatchEvent(new CustomEvent('syrivo:stay-search', { detail: search }))
    const availability = useAvailabilityStore()
    await vi.waitFor(() => expect(['searching', 'done']).toContain(availability.status))
    expect(availability.query).toEqual({
      checkIn: '2099-11-13',
      checkOut: '2099-11-15',
      adults: 2,
      childrenAges: [6],
      rooms: 1,
    })
    expect(useFlexibleSearchStore().entries).toHaveLength(4)
    wrapper.unmount()
  })

  it('keeps the range the guest chose while the month search was running', async () => {
    let release: () => void = () => undefined
    const gate = new Promise<void>((resolve) => (release = resolve))
    const checkAvailability = vi.fn(async (query: StayQuery) => {
      await gate
      return priced(query)
    })
    const wrapper = mountBridge(checkAvailability)
    const availability = useAvailabilityStore()
    const flexible = useFlexibleSearchStore()
    document.dispatchEvent(new CustomEvent('syrivo:stay-search', { detail: search }))
    await vi.waitFor(() => expect(checkAvailability).toHaveBeenCalled())
    const chosen = { checkIn: '2099-11-27', checkOut: '2099-11-29' }
    availability.query = { ...availability.query, ...chosen }
    flexible.noteChoice()
    const search$ = vi.spyOn(availability, 'search').mockResolvedValue()
    release()
    await vi.waitFor(() => expect(flexible.status).toBe('done'))
    await Promise.resolve()
    expect(availability.query).toMatchObject(chosen)
    expect(search$).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('keeps a form edit made while the month search was running', async () => {
    let release: () => void = () => undefined
    const gate = new Promise<void>((resolve) => (release = resolve))
    const checkAvailability = vi.fn(async (query: StayQuery) => {
      await gate
      return priced(query)
    })
    const wrapper = mountBridge(checkAvailability)
    const availability = useAvailabilityStore()
    const flexible = useFlexibleSearchStore()
    document.dispatchEvent(new CustomEvent('syrivo:stay-search', { detail: search }))
    await vi.waitFor(() => expect(checkAvailability).toHaveBeenCalled())
    availability.query.adults = 1
    release()
    await vi.waitFor(() => expect(flexible.status).toBe('done'))
    await Promise.resolve()
    expect(availability.query.checkIn).not.toBe('2099-11-13')
    expect(availability.query.adults).toBe(1)
    wrapper.unmount()
  })

  it('shows the too-many-guests state instead of searching', async () => {
    const checkAvailability = vi.fn()
    const wrapper = mountBridge(checkAvailability)
    document.dispatchEvent(
      new CustomEvent('syrivo:stay-search', { detail: { ...search, adults: MAX_ADULTS + 1 } }),
    )
    await Promise.resolve()
    expect(useFlexibleSearchStore().status).toBe('too-many-guests')
    expect(checkAvailability).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('ignores malformed stay-search details and stops listening after unmount', async () => {
    const checkAvailability = vi.fn(async (query: StayQuery) => priced(query))
    const wrapper = mountBridge(checkAvailability)
    document.dispatchEvent(
      new CustomEvent('syrivo:stay-search', { detail: { ...search, version: 2 } }),
    )
    await Promise.resolve()
    expect(useFlexibleSearchStore().status).toBe('idle')
    expect(checkAvailability).not.toHaveBeenCalled()
    wrapper.unmount()
    document.dispatchEvent(new CustomEvent('syrivo:stay-search', { detail: search }))
    await Promise.resolve()
    expect(useFlexibleSearchStore().status).toBe('idle')
    expect(checkAvailability).not.toHaveBeenCalled()
  })

  it('clears an old month search when a concrete stay intent arrives', async () => {
    const checkAvailability = vi.fn(async (query: StayQuery) => priced(query))
    const wrapper = mountBridge(checkAvailability)
    document.dispatchEvent(new CustomEvent('syrivo:stay-search', { detail: search }))
    const flexible = useFlexibleSearchStore()
    await vi.waitFor(() => expect(flexible.status).toBe('done'))
    document.dispatchEvent(new CustomEvent('syrivo:stay-intent', { detail: stay }))
    expect(flexible.status).toBe('idle')
    expect(flexible.entries).toEqual([])
    wrapper.unmount()
  })
})
