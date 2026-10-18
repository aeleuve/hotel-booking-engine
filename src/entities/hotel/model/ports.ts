import { inject, type InjectionKey } from 'vue'
import type { Availability, HotelProfile, ReviewSummary, RoomType, StayQuery } from './types'

/** Port: everything the landing needs to know about the hotel and its prices. */
export interface HotelRepository {
  getProfile(): Promise<HotelProfile>
  listRooms(): Promise<RoomType[]>
  getReviewSummary(): Promise<ReviewSummary>
  checkAvailability(query: StayQuery): Promise<Availability>
}

export const HOTEL_REPOSITORY: InjectionKey<HotelRepository> = Symbol('HotelRepository')

/** Resolves the provided hotel adapter. Call inside `setup`. */
export const useHotelRepository = (): HotelRepository => {
  const repository = inject(HOTEL_REPOSITORY)
  if (!repository) throw new Error('HotelRepository not provided. Check app/boot/repositories.')
  return repository
}
