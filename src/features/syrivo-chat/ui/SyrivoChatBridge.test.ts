import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { HOTEL_REPOSITORY, type HotelRepository } from 'src/entities/hotel'
import { useAvailabilityStore } from 'src/features/check-availability'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import SyrivoChatBridge from './SyrivoChatBridge.vue'

const stay = {
  version: 1,
  checkIn: '2099-11-03',
  checkOut: '2099-11-05',
  adults: 2,
  children: 1,
  rooms: 1,
}

describe('SyrivoChatBridge', () => {
  it('fills the search and runs it when the widget sends a stay intent', async () => {
    const checkAvailability = vi.fn().mockResolvedValue({ query: stay, nights: 2, rates: [] })
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
      children: 1,
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
    document.dispatchEvent(
      new CustomEvent('syrivo:stay-intent', { detail: { ...stay, version: 9 } }),
    )
    wrapper.unmount()
    document.dispatchEvent(new CustomEvent('syrivo:stay-intent', { detail: stay }))
    await Promise.resolve()
    expect(checkAvailability).not.toHaveBeenCalled()
  })
})
