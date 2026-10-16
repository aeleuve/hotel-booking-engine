import type { Money, StayQuery, VendorRate } from '../model/types'

/** One vendor cell of `/hotel` → `comparison[0]`. Keys carry the vendor index: vendor1, price1… */
export type MakcorpsVendorCell = Record<string, string | null>

export interface MakcorpsHotelResponse {
  comparison: MakcorpsVendorCell[][]
}

export const MAKCORPS_CURRENCY = 'EUR'

const cellValue = (cell: MakcorpsVendorCell, field: string): string | null => {
  const key = Object.keys(cell).find((name) => new RegExp(`^${field}\\d+$`).test(name))
  return key ? (cell[key] ?? null) : null
}

/** Parses Makcorps price strings such as `€1,120` or `$98`. */
export const parseMakcorpsPrice = (value: string | null): Money | null => {
  const amount = Number(value?.replace(/[^\d.]/g, ''))
  return value && Number.isFinite(amount) && amount > 0
    ? { amount, currency: MAKCORPS_CURRENCY }
    : null
}

export const toVendorRate = (cell: MakcorpsVendorCell): VendorRate => ({
  vendor: cellValue(cell, 'vendor') ?? 'Unknown',
  nightly: parseMakcorpsPrice(cellValue(cell, 'price')),
  total: parseMakcorpsPrice(cellValue(cell, 'Totalprice')),
  tax: parseMakcorpsPrice(cellValue(cell, 'tax')),
})

export const toVendorRates = (response: MakcorpsHotelResponse): VendorRate[] =>
  (response.comparison[0] ?? []).map(toVendorRate)

export const toMakcorpsHotelParams = (hotelId: string, query: StayQuery) => ({
  hotelid: hotelId,
  checkin: query.checkIn,
  checkout: query.checkOut,
  adults: query.adults,
  children: query.children,
  rooms: query.rooms,
  currency: MAKCORPS_CURRENCY,
})
