<template><span hidden /></template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useAvailabilityStore } from 'src/features/check-availability'
import { localToday } from 'src/shared/lib/date'
import { parseStayIntent, STAY_INTENT_EVENT } from '../model/stay-intent'

const store = useAvailabilityStore()

const showBookingForm = () =>
  document.getElementById('booking')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })

const onStayIntent = (event: Event) => {
  const query = parseStayIntent((event as CustomEvent).detail)
  if (!query) return
  store.query = query
  void store.search(localToday())
  showBookingForm()
}

onMounted(() => document.addEventListener(STAY_INTENT_EVENT, onStayIntent))
onBeforeUnmount(() => document.removeEventListener(STAY_INTENT_EVENT, onStayIntent))
</script>
