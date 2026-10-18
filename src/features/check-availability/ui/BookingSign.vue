<template>
  <form class="booking-sign" :aria-label="t('booking.title')" novalidate @submit.prevent="submit">
    <label class="booking-sign__cell">
      <SignPictogram icon="flight_land" />
      <span class="booking-sign__field">
        <span class="booking-sign__label">{{ t('booking.checkIn') }}</span>
        <input
          v-model="query.checkIn"
          class="booking-sign__input"
          type="date"
          :min="today"
          required
        />
      </span>
    </label>
    <label class="booking-sign__cell">
      <SignPictogram icon="flight_takeoff" />
      <span class="booking-sign__field">
        <span class="booking-sign__label">{{ t('booking.checkOut') }}</span>
        <input
          v-model="query.checkOut"
          class="booking-sign__input"
          type="date"
          :min="query.checkIn"
          required
        />
      </span>
    </label>
    <GuestPicker
      v-model:query="query"
      class="booking-sign__cell"
      :show-age-errors="error === 'child-age-missing'"
    />
    <button class="booking-sign__submit" type="submit" :aria-busy="status === 'searching'">
      <span>{{ status === 'searching' ? t('booking.searching') : t('booking.submit') }}</span>
      <q-spinner v-if="status === 'searching'" size="1.25rem" />
      <q-icon v-else name="arrow_forward" aria-hidden="true" />
    </button>
    <p v-if="errorMessage" class="booking-sign__error" role="alert">{{ errorMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localToday } from 'src/shared/lib/date'
import { SignPictogram } from 'src/shared/ui'
import { useAvailabilityStore } from '../model/availability-store'
import GuestPicker from './GuestPicker.vue'

const { t } = useI18n()
const store = useAvailabilityStore()
const { query, status, error } = storeToRefs(store)
const today = localToday()
if (status.value === 'idle') store.reset(today)

const errorMessage = computed(() => (error.value ? t(`booking.errors.${error.value}`) : ''))
const submit = () => store.search(today)
</script>

<style scoped lang="scss">
.booking-sign {
  display: grid;
  grid-template-columns: 1fr;
  background: var(--c-signal);
  color: var(--c-tarmac);
  border-radius: var(--radius-sign);
  box-shadow: 0 1.5rem 3rem -1.5rem rgb(36 41 46 / 0.55);
  animation: sign-drop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr) auto;
  }

  &__cell {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-width: 0;
    padding: 1rem 1.25rem;
    border-bottom: 2px solid var(--c-tarmac);
    cursor: pointer;

    @media (min-width: 1024px) {
      border-bottom: 0;
      border-right: 2px solid var(--c-tarmac);
    }
  }

  &__field {
    display: grid;
    min-width: 0;
    flex: 1;
  }

  &__label {
    font-size: var(--fs-small);
    font-weight: 700;
  }

  &__input {
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: 1.125rem;
    font-variant-numeric: tabular-nums;

    &:focus-visible {
      outline-offset: 4px;
    }
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    grid-column: 1 / -1;
    min-height: 4rem;
    padding: 1rem 1.75rem;
    border: 0;
    border-radius: 0 0 var(--radius-sign) var(--radius-sign);
    background: var(--c-tarmac);
    color: var(--c-signal);
    font: inherit;
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: 1.125rem;
    cursor: pointer;
    transition: background-color 0.15s;

    @media (min-width: 1024px) {
      grid-column: auto;
      border-radius: 0 var(--radius-sign) var(--radius-sign) 0;
    }

    &:hover {
      background: #000;
    }

    &:focus-visible {
      outline-color: var(--c-tarmac);
      outline-offset: 3px;
    }

    .q-icon {
      font-size: 1.5rem;
    }
  }

  &__error {
    grid-column: 1 / -1;
    padding: 0.75rem 1.25rem;
    background: var(--c-white);
    font-weight: 600;
    color: #8a1c14;
  }
}

@keyframes sign-drop {
  from {
    opacity: 0;
    transform: translateY(-0.75rem);
  }
}
</style>
