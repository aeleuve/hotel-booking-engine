<template>
  <div class="room-offers" aria-live="polite">
    <p v-if="status === 'searching'" class="room-offers__state">
      <q-spinner size="1.5rem" /> {{ t('results.searching') }}
    </p>
    <template v-else-if="result">
      <p class="room-offers__summary">
        {{ formatDay(result.query.checkIn, locale) }} –
        {{ formatDay(result.query.checkOut, locale) }},
        {{
          t(
            'results.summary',
            { nights: result.nights, guests: countGuests(result.query) },
            result.nights,
          )
        }}
      </p>
      <RoomOfferCard
        v-for="group in groups"
        :key="group.room?.id ?? group.offers[0]!.offerId"
        :group="group"
        :nights="result.nights"
        @reserve="emit('reserve', $event)"
      />
      <p v-if="!groups.length" class="room-offers__state">
        <i18n-t keypath="results.empty" scope="global">
          <template #phone>
            <a :href="`tel:${phone.replace(/\s/g, '')}`">{{ phone }}</a>
          </template>
        </i18n-t>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { countGuests, groupOffersByRoom, type RateOffer, type RoomType } from 'src/entities/hotel'
import { formatDay } from 'src/shared/lib/date'
import { useAvailabilityStore } from '../model/availability-store'
import RoomOfferCard from './RoomOfferCard.vue'

const props = defineProps<{ rooms: RoomType[]; phone: string }>()
const emit = defineEmits<{ reserve: [offer: RateOffer] }>()
const { t, locale } = useI18n()
const { status, result } = storeToRefs(useAvailabilityStore())

const groups = computed(() =>
  result.value ? groupOffersByRoom(result.value.offers, props.rooms) : [],
)
</script>

<style scoped lang="scss">
.room-offers {
  display: grid;
  gap: 1.25rem;

  &__summary {
    font-weight: 600;
    color: var(--c-tarmac-soft);
  }

  &__state {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    background: var(--c-white);
    border-radius: var(--radius-sign);
    font-weight: 600;
  }
}
</style>
