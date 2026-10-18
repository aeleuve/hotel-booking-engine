import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { HOTEL_REPOSITORY, type HotelRepository } from 'src/entities/hotel'
import { useAvailabilityStore } from 'src/features/check-availability'
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
})
