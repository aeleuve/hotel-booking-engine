<template><span hidden /></template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useAvailabilityStore } from 'src/features/check-availability'
import { useFlexibleSearchStore } from 'src/features/flexible-search'
import { localToday } from 'src/shared/lib/date'
import { parseStayIntent, STAY_INTENT_EVENT } from '../model/stay-intent'
import { parseStaySearch, STAY_SEARCH_EVENT } from '../model/stay-search'

const store = useAvailabilityStore()
const flexible = useFlexibleSearchStore()

const showBookingForm = () =>
  document.getElementById('booking')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })

const onStayIntent = (event: Event) => {
  const query = parseStayIntent((event as CustomEvent).detail)
  if (!query) return
  flexible.clear()
  store.query = query
  void store.search(localToday())
  showBookingForm()
}

const onStaySearch = async (event: Event) => {
  const parsed = parseStaySearch((event as CustomEvent).detail)
  if (!parsed.ok) {
    if (parsed.reason === 'too-many-guests') flexible.rejectGuests()
    return
  }
  showBookingForm()
  const best = await flexible.run(parsed.request, localToday())
  if (!best) return
  store.query = { ...best.range, ...parsed.request.guests }
  void store.search(localToday())
}

onMounted(() => {
  document.addEventListener(STAY_INTENT_EVENT, onStayIntent)
  document.addEventListener(STAY_SEARCH_EVENT, onStaySearch)
})
onBeforeUnmount(() => {
  document.removeEventListener(STAY_INTENT_EVENT, onStayIntent)
  document.removeEventListener(STAY_SEARCH_EVENT, onStaySearch)
})
</script>
