import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  bestStayPrice,
  flexibleStayRanges,
  useHotelRepository,
  useHotelStore,
  type DateRange,
  type FlexibleStay,
  type IsoDate,
  type Money,
  type StayQuery,
} from 'src/entities/hotel'

/** How many date ranges are priced at the same time. */
export const SEARCH_CONCURRENCY = 4

/** What the chat asked for; same shape as the Syrivo stay-search request. */
export interface FlexibleSearchRequest {
  stay: FlexibleStay
  guests: Pick<StayQuery, 'adults' | 'childrenAges' | 'rooms'>
  roomType?: string
}

export type FlexibleEntryState = 'pending' | 'priced' | 'unavailable' | 'failed'

export interface FlexibleEntry {
  range: DateRange
  price: Money | null
  state: FlexibleEntryState
}

export type FlexibleSearchStatus = 'idle' | 'searching' | 'done' | 'error' | 'too-many-guests'

/** Prices every candidate date range of a month search and keeps the cheapest. */
export const useFlexibleSearchStore = defineStore('flexible-search', () => {
  const repository = useHotelRepository()
  const hotel = useHotelStore()
  const request = ref<FlexibleSearchRequest | null>(null)
  const entries = ref<FlexibleEntry[]>([])
  const status = ref<FlexibleSearchStatus>('idle')
  const done = ref(0)
  /** How many times the guest picked a range from the strip. */
  const choices = ref(0)
  let latestRun = 0

  const best = computed<FlexibleEntry | null>(
    () =>
      entries.value
        .filter((entry) => entry.state === 'priced' && entry.price)
        .toSorted(
          (a, b) =>
            a.price!.amount - b.price!.amount || a.range.checkIn.localeCompare(b.range.checkIn),
        )[0] ?? null,
  )

  const priceEntry = async (entry: FlexibleEntry, { guests, roomType }: FlexibleSearchRequest) => {
    const availability = await repository.checkAvailability({ ...entry.range, ...guests })
    entry.price = bestStayPrice(availability, hotel.rooms, roomType)
    entry.state = entry.price ? 'priced' : 'unavailable'
  }

  const finalStatus = (): FlexibleSearchStatus =>
    entries.value.length > 0 && entries.value.every((entry) => entry.state === 'failed')
      ? 'error'
      : 'done'

  /**
   * Prices every candidate range of the request, `SEARCH_CONCURRENCY` at a time.
   * A newer `run` or `clear` makes this one stop touching the store.
   * @returns the cheapest range, or `null` when none is priced or the run was replaced.
   */
  const run = async (
    nextRequest: FlexibleSearchRequest,
    today: IsoDate,
  ): Promise<FlexibleEntry | null> => {
    const runId = ++latestRun
    request.value = nextRequest
    done.value = 0
    status.value = 'searching'
    entries.value = flexibleStayRanges(nextRequest.stay, today).map((range) => ({
      range,
      price: null,
      state: 'pending',
    }))
    const queue = entries.value.map((_, index) => index)
    const worker = async () => {
      for (let index = queue.shift(); index !== undefined; index = queue.shift()) {
        const entry = entries.value[index]!
        try {
          await priceEntry(entry, nextRequest)
        } catch {
          if (runId === latestRun) entry.state = 'failed'
        }
        if (runId !== latestRun) return
        done.value++
      }
    }
    await Promise.all(Array.from({ length: SEARCH_CONCURRENCY }, worker))
    if (runId !== latestRun) return null
    status.value = finalStatus()
    return best.value
  }

  /** Records that the guest picked a range, so a running search will not override it. */
  const noteChoice = () => {
    choices.value++
  }

  /** Shows that the guests do not fit in one room, without searching. */
  const rejectGuests = () => {
    clear()
    status.value = 'too-many-guests'
  }

  /** Forgets the current search and ignores any run still in flight. */
  const clear = () => {
    latestRun++
    request.value = null
    entries.value = []
    done.value = 0
    status.value = 'idle'
  }

  return { request, entries, status, done, choices, best, run, noteChoice, rejectGuests, clear }
})
