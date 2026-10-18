import { describe, expect, it } from 'vitest'
import { defaultStay } from '../model/stay'
import { brandContent } from './hotel-catalog'
import {
  to24Hour,
  toHotelProfile,
  toRateOffers,
  toRatesRequest,
  toReviewSummary,
  toRoomType,
  type LiteApiRatesResponse,
} from './liteapi-hotel-rows'
import { hotelDetailsFixture, reviewsFixture } from './mock-liteapi-fixtures'

/** Two offers trimmed from a sandbox `/hotels/rates` answer (2026-10-18). */
const ratesSample: LiteApiRatesResponse = {
  data: [
    {
      hotelId: 'lp42e6e',
      roomTypes: [
        {
          offerId: 'AwJ2MQAAAABq1bIIXnbXy2gZ',
          offerRetailRate: { amount: 450.09, currency: 'EUR' },
          rates: [
            {
              mappedRoomId: 1459502343,
              name: 'TRIPLE ADULT',
              boardType: 'RO',
              boardName: 'Room Only',
              retailRate: {
                total: [{ amount: 450.09, currency: 'EUR' }],
                taxesAndFees: [{ included: true, amount: 41.54, currency: 'EUR' }],
              },
              cancellationPolicies: { cancelPolicyInfos: [], refundableTag: 'NRFN' },
            },
          ],
        },
        {
          offerId: 'AwJ2MQAAAABq1bII1Qb6K0j2',
          offerRetailRate: { amount: 500.31, currency: 'EUR' },
          rates: [
            {
              mappedRoomId: 613062,
              name: 'Double Room with Extra Bed',
              boardType: 'BI',
              boardName: 'Breakfast Included',
              retailRate: {
                total: [{ amount: 500.31, currency: 'EUR' }],
                taxesAndFees: [
                  { included: true, amount: 50.03, currency: 'EUR' },
                  { included: false, amount: 6.6, currency: 'EUR' },
                ],
              },
              cancellationPolicies: {
                refundableTag: 'RFN',
                cancelPolicyInfos: [
                  { cancelTime: '2026-11-09 10:00:00', amount: 500.31, currency: 'EUR' },
                  { cancelTime: '2026-11-03 18:00:00', amount: 232.9, currency: 'EUR' },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}

describe('liteapi hotel rows', () => {
  const hotel = hotelDetailsFixture.data

  it.each([
    ['02:00 PM', '14:00'],
    ['12:00 PM', '12:00'],
    ['12:30 AM', '00:30'],
    ['11:00', '11:00'],
  ])('converts %s to %s', (input, output) => {
    expect(to24Hour(input)).toBe(output)
  })

  it('merges brand and property into the profile', () => {
    const profile = toHotelProfile(hotel, brandContent)
    expect(profile).toMatchObject({
      name: 'Hotel Pista Siete',
      propertyName: hotel.name,
      checkInFrom: '14:00',
      checkOutUntil: '12:00',
      location: hotel.location,
    })
    expect(profile.address).toContain(hotel.address)
  })

  it('maps rooms with main photo first and bed counts', () => {
    const room = toRoomType({
      id: 7,
      roomName: 'Triple',
      roomSizeSquare: 28,
      roomSizeUnit: 'sqm',
      maxOccupancy: 3,
      bedTypes: [{ quantity: 2, bedType: 'Twin bed' }],
      photos: [
        { url: 'b.jpg', mainPhoto: false },
        { url: 'a.jpg', mainPhoto: true },
      ],
    })
    expect(room).toEqual({
      id: '7',
      name: 'Triple',
      sizeM2: 28,
      maxGuests: 3,
      beds: ['2 × Twin bed'],
      photoUrls: ['a.jpg', 'b.jpg'],
    })
  })

  it('keeps only reviews with something to quote', () => {
    const summary = toReviewSummary(hotel, reviewsFixture)
    expect(summary.score).toBe(hotel.rating)
    expect(summary.quotes.every(({ text }) => text.length >= 20)).toBe(true)
  })

  it('maps offers with taxes, fees and the first penalty time', () => {
    const [nonRefundable, refundable] = toRateOffers(ratesSample)
    expect(nonRefundable).toMatchObject({
      roomId: '1459502343',
      refundable: false,
      freeCancellationUntil: null,
    })
    expect(refundable).toEqual({
      offerId: 'AwJ2MQAAAABq1bII1Qb6K0j2',
      roomId: '613062',
      name: 'Double Room with Extra Bed',
      board: { code: 'BI', name: 'Breakfast Included' },
      refundable: true,
      freeCancellationUntil: '2026-11-03T18:00:00Z',
      total: { amount: 500.31, currency: 'EUR' },
      taxesIncluded: { amount: 50.03, currency: 'EUR' },
      payAtHotel: { amount: 6.6, currency: 'EUR' },
    })
  })

  it('builds the rates request with occupancies per room', () => {
    const query = { ...defaultStay('2026-11-10'), adults: 3, childrenAges: [6], rooms: 2 }
    expect(
      toRatesRequest(query, { hotelId: 'lp42e6e', currency: 'EUR', nationality: 'ES' }),
    ).toEqual({
      hotelIds: ['lp42e6e'],
      occupancies: [
        { adults: 2, children: [6] },
        { adults: 1, children: [] },
      ],
      currency: 'EUR',
      guestNationality: 'ES',
      checkin: '2026-11-10',
      checkout: '2026-11-11',
      timeout: 8,
      roomMapping: true,
    })
  })
})
