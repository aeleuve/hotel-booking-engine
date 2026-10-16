import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  defaultStay,
  useHotelRepository,
  validateStay,
  type Availability,
  type IsoDate,
  type StayError,
  type StayQuery,
} from 'src/entities/hotel'

export type SearchStatus = 'idle' | 'searching' | 'done' | 'invalid' | 'error'
export type SearchError = StayError | 'network'

/** Stay being searched and the prices returned for it. */
export const useAvailabilityStore = defineStore('availability', () => {
  const repository = useHotelRepository()
  const query = ref<StayQuery>(defaultStay('1970-01-01'))
  const status = ref<SearchStatus>('idle')
  const error = ref<SearchError | null>(null)
  const result = ref<Availability | null>(null)
  let latestSearch = 0

  const reset = (today: IsoDate) => {
    query.value = defaultStay(today)
    status.value = 'idle'
    error.value = null
    result.value = null
  }

  const search = async (today: IsoDate) => {
    error.value = validateStay(query.value, today)
    if (error.value) {
      status.value = 'invalid'
      return
    }
    const searchId = ++latestSearch
    status.value = 'searching'
    try {
      const availability = await repository.checkAvailability({ ...query.value })
      if (searchId !== latestSearch) return
      result.value = availability
      status.value = 'done'
    } catch {
      if (searchId !== latestSearch) return
      error.value = 'network'
      status.value = 'error'
    }
  }

  return { query, status, error, result, reset, search }
})
