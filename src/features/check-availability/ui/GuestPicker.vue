<template>
  <button type="button" class="guest-picker" :aria-label="`${t('booking.guests')}: ${summary}`">
    <SignPictogram icon="group" />
    <span class="guest-picker__field">
      <span class="guest-picker__label">{{ t('booking.guests') }}</span>
      <span class="guest-picker__value">{{ summary }}</span>
    </span>
    <q-menu anchor="bottom left" self="top left" :offset="[0, 8]">
      <div class="guest-picker__panel">
        <CounterField
          v-model="query.adults"
          :label="t('booking.adults')"
          :min="1"
          :max="MAX_ADULTS"
        />
        <CounterField v-model="childrenCount" :label="t('booking.children')" :max="MAX_CHILDREN" />
        <q-select
          v-for="(age, index) in query.childrenAges"
          :key="index"
          :model-value="age"
          :options="AGE_OPTIONS"
          :label="t('booking.childAge', { n: index + 1 })"
          :error="age === null && showAgeErrors"
          :error-message="t('booking.errors.child-age-missing')"
          emit-value
          map-options
          outlined
          dense
          class="q-mb-sm"
          @update:model-value="(value: number) => (query.childrenAges[index] = value)"
        />
        <CounterField
          v-model="query.rooms"
          :label="t('booking.rooms')"
          :min="1"
          :max="query.adults"
        />
        <q-btn
          v-close-popup
          unelevated
          no-caps
          color="secondary"
          :label="t('booking.done')"
          class="full-width q-mt-sm"
        />
      </div>
    </q-menu>
  </button>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  countGuests,
  MAX_ADULTS,
  MAX_CHILD_AGE,
  MAX_CHILDREN,
  type StayQuery,
} from 'src/entities/hotel'
import { CounterField, SignPictogram } from 'src/shared/ui'

const query = defineModel<StayQuery>('query', { required: true })
defineProps<{ showAgeErrors?: boolean }>()
const { t } = useI18n()

const AGE_OPTIONS = Array.from({ length: MAX_CHILD_AGE + 1 }, (_, age) => ({
  value: age,
  label: String(age),
}))

const childrenCount = computed({
  get: () => query.value.childrenAges.length,
  set: (count: number) => {
    const ages = query.value.childrenAges.slice(0, count)
    query.value.childrenAges = [...ages, ...Array.from({ length: count - ages.length }, () => null)]
  },
})

const summary = computed(() =>
  t(
    'booking.guestSummary',
    { guests: countGuests(query.value), rooms: query.value.rooms },
    query.value.rooms,
  ),
)

watch(
  () => query.value.adults,
  (adults) => {
    if (query.value.rooms > adults) query.value.rooms = adults
  },
)
</script>

<style scoped lang="scss">
.guest-picker {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;

  &__field {
    display: grid;
    min-width: 0;
  }

  &__label {
    font-size: var(--fs-small);
    font-weight: 700;
  }

  &__value {
    font-weight: 700;
    line-height: 1.3;
  }

  &__panel {
    min-width: 18rem;
    padding: 1rem 1.25rem;
  }
}
</style>
