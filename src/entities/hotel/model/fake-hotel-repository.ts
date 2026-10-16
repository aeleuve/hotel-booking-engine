import type { HotelRepository } from './ports'
import type { HotelProfile, RoomType } from './types'

const eur = (amount: number) => ({ amount, currency: 'EUR' as const })

const profile: HotelProfile = {
  name: 'Test Hotel',
  stars: 4,
  address: 'Test street 1',
  phone: '+34 900 000 000',
  whatsapp: '+34 600 000 000',
  email: 'test@example.test',
  location: { latitude: 40.46, longitude: -3.58 },
  minutesToAirport: 6,
  heroImageUrl: 'hero.jpg',
  shuttleDepartures: ['06:00'],
}

const room: RoomType = {
  id: 'standard',
  sizeM2: 22,
  maxGuests: 2,
  bed: 'double',
  imageUrl: 'room.jpg',
  fromPrice: eur(89),
}

/** In-memory repository for unit tests; override any method per test. */
export const createFakeHotelRepository = (
  overrides: Partial<HotelRepository> = {},
): HotelRepository => ({
  getProfile: () => Promise.resolve(profile),
  listRooms: () => Promise.resolve([room]),
  listOffers: () => Promise.resolve([]),
  getReviewSummary: () => Promise.resolve({ score: 8.8, count: 10, quotes: [] }),
  checkAvailability: (query) =>
    Promise.resolve({
      query,
      nights: 1,
      rates: [{ vendor: 'Booking.com', nightly: eur(100), total: eur(100), tax: null }],
    }),
  ...overrides,
})
