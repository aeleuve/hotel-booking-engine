import type { HotelRepository } from './ports'
import type { HotelProfile, RateOffer, RoomType } from './types'

const eur = (amount: number) => ({ amount, currency: 'EUR' })

const profile: HotelProfile = {
  name: 'Test Hotel',
  propertyName: 'Test Property',
  stars: 4,
  address: 'Test street 1',
  phone: '+34 900 000 000',
  whatsapp: '+34 600 000 000',
  email: 'test@example.test',
  location: { latitude: 40.45, longitude: -3.59 },
  checkInFrom: '14:00',
  checkOutUntil: '12:00',
  heroImageUrl: 'hero.jpg',
  shuttleDepartures: ['06:00'],
}

const room: RoomType = {
  id: '1',
  name: 'Double Room',
  sizeM2: 22,
  maxGuests: 2,
  beds: ['Double bed'],
  photoUrls: ['room.jpg'],
}

export const fakeOffer: RateOffer = {
  offerId: 'offer-1',
  roomId: '1',
  name: 'DOUBLE ROOM',
  board: { code: 'BI', name: 'Breakfast Included' },
  refundable: true,
  freeCancellationUntil: '2026-11-08T10:00:00Z',
  total: eur(200),
  taxesIncluded: eur(20),
  payAtHotel: null,
}

/** In-memory repository for unit tests; override any method per test. */
export const createFakeHotelRepository = (
  overrides: Partial<HotelRepository> = {},
): HotelRepository => ({
  getProfile: () => Promise.resolve(profile),
  listRooms: () => Promise.resolve([room]),
  getReviewSummary: () => Promise.resolve({ score: 9, count: 10, quotes: [] }),
  checkAvailability: (query) => Promise.resolve({ query, nights: 1, offers: [fakeOffer] }),
  ...overrides,
})
