<template>
  <article class="room-offer">
    <img
      v-if="photo"
      class="room-offer__photo"
      :src="photo"
      :alt="name"
      loading="lazy"
      width="640"
      height="480"
    />
    <div class="room-offer__body">
      <h3 class="room-offer__name">{{ name }}</h3>
      <ul v-if="group.room" class="room-offer__facts">
        <li v-if="group.room.sizeM2">
          <q-icon name="square_foot" aria-hidden="true" />{{
            t('rooms.size', { n: group.room.sizeM2 })
          }}
        </li>
        <li>
          <q-icon name="group" aria-hidden="true" />{{
            t('rooms.guests', { n: group.room.maxGuests })
          }}
        </li>
        <li v-if="group.room.beds.length">
          <q-icon name="bed" aria-hidden="true" />{{ group.room.beds.join(', ') }}
        </li>
      </ul>
      <ul class="room-offer__rates">
        <RateRow
          v-for="offer in visibleOffers"
          :key="offer.offerId"
          :offer="offer"
          :nights="nights"
          @reserve="emit('reserve', $event)"
        />
      </ul>
      <q-btn
        v-if="hiddenCount > 0"
        flat
        no-caps
        color="primary"
        :label="t('rates.showMore', { n: hiddenCount })"
        class="room-offer__more"
        @click="expanded = true"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RateOffer, RoomAvailability } from 'src/entities/hotel'
import RateRow from './RateRow.vue'

const COLLAPSED_RATES = 3

const props = defineProps<{ group: RoomAvailability; nights: number }>()
const emit = defineEmits<{ reserve: [offer: RateOffer] }>()
const { t } = useI18n()
const expanded = ref(false)

const name = computed(() => props.group.room?.name ?? props.group.offers[0]!.name)
const photo = computed(() => props.group.room?.photoUrls[0] ?? null)
const visibleOffers = computed(() =>
  expanded.value ? props.group.offers : props.group.offers.slice(0, COLLAPSED_RATES),
)
const hiddenCount = computed(() => props.group.offers.length - visibleOffers.value.length)
</script>

<style scoped lang="scss">
.room-offer {
  display: grid;
  gap: 1.25rem;
  padding: clamp(1rem, 3vw, 1.5rem);
  background: var(--c-white);
  border-radius: var(--radius-sign);

  @media (min-width: 900px) {
    grid-template-columns: 18rem 1fr;
    gap: 2rem;
  }

  &__photo {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--radius-sign);
    background: var(--c-concrete-deep);
  }

  &__name {
    font-size: var(--fs-h3);
    margin-bottom: 0.5rem;
  }

  &__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    margin: 0 0 0.75rem;
    padding: 0;
    list-style: none;
    font-size: var(--fs-small);

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
  }

  &__rates {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__more {
    margin-top: 0.25rem;
    font-weight: 700;
  }
}
</style>
