import { addDays, countNights, toOccupancies } from '../model/stay'
import type { StayQuery } from '../model/types'
import type {
  LiteApiHotelRow,
  LiteApiRatesResponse,
  LiteApiRoomTypeRow,
} from './liteapi-hotel-rows'

const BOARDS = [
  { boardType: 'RO', boardName: 'Room Only', supplement: 0 },
  { boardType: 'BI', boardName: 'Breakfast Included', supplement: 18 },
]
const REFUNDABLE_MARKUP = 1.12
const VAT = 0.1

const roundCents = (amount: number) => Math.round(amount * 100) / 100

const nightlyFor = (room: LiteApiHotelRow['rooms'][number]) => 70 + (room.roomSizeSquare ?? 20) * 2

/** Free cancellation ends two days before arrival, 10:00 GMT. */
const cancelDeadline = (checkIn: string) => `${addDays(checkIn, -2)} 10:00:00`

const offerFor = (
  room: LiteApiHotelRow['rooms'][number],
  query: StayQuery,
  board: (typeof BOARDS)[number],
  refundable: boolean,
): LiteApiRoomTypeRow => {
  const guests = query.adults + query.childrenAges.length
  const nightly =
    (nightlyFor(room) + board.supplement * guests) * (refundable ? REFUNDABLE_MARKUP : 1)
  const amount = roundCents(nightly * countNights(query) * query.rooms)
  const total = { amount, currency: 'EUR' }
  return {
    offerId: `mock-${room.id}-${board.boardType}-${refundable ? 'rfn' : 'nrfn'}`,
    offerRetailRate: total,
    rates: [
      {
        mappedRoomId: room.id,
        name: room.roomName.toUpperCase(),
        boardType: board.boardType,
        boardName: board.boardName,
        retailRate: {
          total: [total],
          taxesAndFees: [{ included: true, amount: roundCents(amount * VAT), currency: 'EUR' }],
        },
        cancellationPolicies: {
          refundableTag: refundable ? 'RFN' : 'NRFN',
          cancelPolicyInfos: refundable
            ? [{ cancelTime: cancelDeadline(query.checkIn), amount, currency: 'EUR' }]
            : [],
        },
      },
    ],
  }
}

/** Builds a `/hotels/rates` answer in LiteAPI shape for rooms that fit the party. */
export const buildRatesFixture = (
  hotel: LiteApiHotelRow,
  query: StayQuery,
): LiteApiRatesResponse => {
  const largestRoom = Math.max(
    ...toOccupancies(query).map(({ adults, childrenAges }) => adults + childrenAges.length),
  )
  const fitting = hotel.rooms.filter((room) => room.maxOccupancy >= largestRoom)
  const roomTypes = fitting.flatMap((room) =>
    BOARDS.flatMap((board) =>
      [false, true].map((refundable) => offerFor(room, query, board, refundable)),
    ),
  )
  return { data: roomTypes.length ? [{ hotelId: hotel.id, roomTypes }] : [] }
}
