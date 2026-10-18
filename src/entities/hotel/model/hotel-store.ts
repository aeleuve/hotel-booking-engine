import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useHotelRepository } from './ports'
import type { HotelProfile, ReviewSummary, RoomType } from './types'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

/** Hotel content: profile, room types and reviews. */
export const useHotelStore = defineStore('hotel', () => {
  const repository = useHotelRepository()
  const status = ref<LoadStatus>('idle')
  const profile = ref<HotelProfile | null>(null)
  const rooms = ref<RoomType[]>([])
  const reviews = ref<ReviewSummary | null>(null)

  const load = async () => {
    if (status.value === 'loading' || status.value === 'ready') return
    status.value = 'loading'
    try {
      ;[profile.value, rooms.value, reviews.value] = await Promise.all([
        repository.getProfile(),
        repository.listRooms(),
        repository.getReviewSummary(),
      ])
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  return { status, profile, rooms, reviews, load }
})
