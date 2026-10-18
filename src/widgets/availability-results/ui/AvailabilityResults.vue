<template>
  <section
    v-if="status !== 'idle' && status !== 'invalid'"
    id="availability"
    ref="section"
    class="page-section results"
    aria-labelledby="results-title"
  >
    <div class="container">
      <SectionHeader title-id="results-title" :title="t('results.title')" />
      <RoomOffersList :rooms="rooms" :phone="profile?.phone ?? ''" @reserve="reserve" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useHotelStore, type RateOffer } from 'src/entities/hotel'
import { RoomOffersList, useAvailabilityStore } from 'src/features/check-availability'
import { useCheckoutStore } from 'src/features/checkout'
import { SectionHeader } from 'src/shared/ui'

const { t } = useI18n()
const router = useRouter()
const availability = useAvailabilityStore()
const checkout = useCheckoutStore()
const { status } = storeToRefs(availability)
const { rooms, profile } = storeToRefs(useHotelStore())
const section = ref<HTMLElement | null>(null)

watch(status, async (next) => {
  if (next !== 'searching') return
  await nextTick()
  section.value?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
})

const reserve = (offer: RateOffer) => {
  checkout.start(offer, availability.query)
  void router.push({ name: 'checkout' })
}
</script>

<style scoped lang="scss">
.results {
  padding-top: clamp(2.5rem, 6vw, 4rem);
}
</style>
