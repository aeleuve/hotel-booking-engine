import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { HOTEL_REPOSITORY, useHotelStore, type HotelProfile } from 'src/entities/hotel'
import { createFakeHotelRepository } from 'src/entities/hotel/model/fake-hotel-repository'
import { useAvailabilityStore } from 'src/features/check-availability'
import { createAppI18n } from 'src/shared/i18n'
import { localToday } from 'src/shared/lib/date'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import { useFlexibleSearchStore, type FlexibleEntry } from '../model/flexible-search-store'
import PriceStrip from './PriceStrip.vue'

const phone = '+34 910 000 777'

const priced = (checkIn: string, checkOut: string, amount: number): FlexibleEntry => ({
  range: { checkIn, checkOut },
  price: { amount, currency: 'EUR' },
  state: 'priced',
})

const threeWeekends = [
  priced('2099-11-06', '2099-11-08', 160),
  priced('2099-11-13', '2099-11-15', 120),
  priced('2099-11-20', '2099-11-22', 200),
]

const mountStrip = () => {
  const repository = createFakeHotelRepository()
  const { pinia } = setupPiniaWith(provision(HOTEL_REPOSITORY, repository))
  useHotelStore().profile = { phone } as HotelProfile
  const flexible = useFlexibleSearchStore()
  const availability = useAvailabilityStore()
  const mountIt = () =>
    mount(PriceStrip, {
      global: {
        plugins: [pinia, createAppI18n('en')],
        provide: { [HOTEL_REPOSITORY as symbol]: repository },
      },
    })
  return { flexible, availability, mountIt }
}

describe('PriceStrip', () => {
  it('lists each date range with its price and marks the cheapest', () => {
    const { flexible, availability, mountIt } = mountStrip()
    flexible.entries = threeWeekends
    flexible.status = 'done'
    flexible.done = 3
    availability.query = { ...availability.query, checkIn: '2099-11-13', checkOut: '2099-11-15' }
    const buttons = mountIt().findAll('ol button')
    expect(buttons).toHaveLength(3)
    expect(buttons.map((button) => button.text())).toEqual([
      expect.stringContaining('€160'),
      expect.stringContaining('€120'),
      expect.stringContaining('€200'),
    ])
    expect(buttons[1]!.text()).toContain('Best price')
    expect(buttons[1]!.attributes('aria-current')).toBe('true')
    for (const other of [buttons[0]!, buttons[2]!]) {
      expect(other.text()).not.toContain('Best price')
      expect(other.attributes('aria-current')).toBeUndefined()
    }
  })

  it('shows progress while searching', () => {
    const { flexible, mountIt } = mountStrip()
    flexible.entries = [
      ...threeWeekends.slice(0, 2),
      { range: { checkIn: '2099-11-27', checkOut: '2099-11-29' }, price: null, state: 'pending' },
      { range: { checkIn: '2099-11-28', checkOut: '2099-11-30' }, price: null, state: 'pending' },
    ]
    flexible.status = 'searching'
    flexible.done = 2
    expect(mountIt().get('[role="status"]').text()).toBe('Checking 2 of 4 dates')
  })

  it('loads a chosen range into the booking form and searches it', async () => {
    const { flexible, availability, mountIt } = mountStrip()
    flexible.entries = threeWeekends
    flexible.status = 'done'
    const search = vi.spyOn(availability, 'search').mockResolvedValue()
    const wrapper = mountIt()
    await wrapper.findAll('ol button')[0]!.trigger('click')
    expect(availability.query.checkIn).toBe('2099-11-06')
    expect(availability.query.checkOut).toBe('2099-11-08')
    expect(search).toHaveBeenCalledWith(localToday())
    expect(wrapper.findAll('ol button')[0]!.attributes('aria-current')).toBe('true')
  })

  it('shows sold out and failed ranges as disabled', () => {
    const { flexible, mountIt } = mountStrip()
    flexible.entries = [
      priced('2099-11-06', '2099-11-08', 160),
      {
        range: { checkIn: '2099-11-13', checkOut: '2099-11-15' },
        price: null,
        state: 'unavailable',
      },
      { range: { checkIn: '2099-11-20', checkOut: '2099-11-22' }, price: null, state: 'failed' },
    ]
    flexible.status = 'done'
    const [open, soldOut, failed] = mountIt().findAll('ol button')
    expect(open!.attributes('disabled')).toBeUndefined()
    expect(soldOut!.attributes('disabled')).toBeDefined()
    expect(soldOut!.text()).toContain('Sold out')
    expect(failed!.attributes('disabled')).toBeDefined()
    expect(failed!.text()).toContain('Not available right now')
  })

  it('explains when no date has rooms, when every search failed and when there are too many guests', async () => {
    const { flexible, mountIt } = mountStrip()
    flexible.entries = [
      {
        range: { checkIn: '2099-11-06', checkOut: '2099-11-08' },
        price: null,
        state: 'unavailable',
      },
    ]
    flexible.status = 'done'
    const wrapper = mountIt()
    expect(wrapper.get('[role="alert"]').text()).toBe(
      `No rooms left on any of these dates. Try another month or call ${phone}.`,
    )
    expect(wrapper.get('[role="alert"] a').attributes('href')).toBe('tel:+34910000777')

    flexible.entries = [
      { range: { checkIn: '2099-11-06', checkOut: '2099-11-08' }, price: null, state: 'failed' },
    ]
    flexible.status = 'error'
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="alert"]').text()).toBe(
      `We could not check prices right now. Please try again or call ${phone}.`,
    )

    flexible.rejectGuests()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="alert"]').text()).toBe(
      `This many guests cannot be booked online. Call ${phone} and we will find rooms for you.`,
    )
    expect(wrapper.find('ol').exists()).toBe(false)
  })

  it('renders nothing while idle', () => {
    const { mountIt } = mountStrip()
    const wrapper = mountIt()
    expect(wrapper.find('section').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })
})
