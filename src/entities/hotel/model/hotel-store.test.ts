import { describe, expect, it, vi } from 'vitest'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import { createFakeHotelRepository } from './fake-hotel-repository'
import { useHotelStore } from './hotel-store'
import { HOTEL_REPOSITORY } from './ports'

describe('hotel store', () => {
  it('loads every piece of content once', async () => {
    const fake = createFakeHotelRepository()
    const listRooms = vi.spyOn(fake, 'listRooms')
    setupPiniaWith(provision(HOTEL_REPOSITORY, fake))
    const store = useHotelStore()

    await Promise.all([store.load(), store.load()])

    expect(store.status).toBe('ready')
    expect(store.rooms).toHaveLength(1)
    expect(store.profile?.name).toBe('Test Hotel')
    expect(listRooms).toHaveBeenCalledOnce()
  })

  it('flags errors from the repository', async () => {
    const fake = createFakeHotelRepository({ getProfile: () => Promise.reject(new Error('down')) })
    setupPiniaWith(provision(HOTEL_REPOSITORY, fake))
    const store = useHotelStore()

    await store.load()

    expect(store.status).toBe('error')
  })
})
