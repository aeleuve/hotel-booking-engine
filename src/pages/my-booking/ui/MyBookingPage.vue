<template>
  <q-page class="my-booking">
    <div class="container my-booking__inner">
      <h1 class="my-booking__title">{{ t('myBooking.title') }}</h1>
      <p class="my-booking__lede">{{ t('myBooking.lede') }}</p>
      <BookingLookupForm
        :initial-id="queryValue('id')"
        :initial-email="queryValue('email')"
        :loading="status === 'looking'"
        @submit="manage.lookup"
      />
      <p v-if="error === 'not-found'" class="my-booking__error" role="alert">
        {{ t('myBooking.notFound') }}
      </p>

      <article v-if="booking && status !== 'looking'" class="my-booking__card" aria-live="polite">
        <header class="my-booking__head">
          <h2>{{ booking.hotelName }}</h2>
          <span class="my-booking__status" :class="`my-booking__status--${booking.status}`">
            {{ t(`myBooking.status.${booking.status}`) }}
          </span>
        </header>
        <p>
          {{ t('myBooking.holder') }}: {{ booking.holder.firstName }} {{ booking.holder.lastName }}
        </p>
        <BookingSummary
          :check-in="booking.checkIn"
          :check-out="booking.checkOut"
          :rooms="booking.rooms"
          :price="booking.price"
          :refundable="booking.refundable"
          :free-cancellation-until="booking.freeCancellationUntil"
        />
        <p v-if="cancellation" class="my-booking__done" role="status">
          {{
            t('myBooking.cancelled', {
              refund: formatMoney(cancellation.refund),
              fee: formatMoney(cancellation.fee),
            })
          }}
        </p>
        <CancelBookingButton
          v-else-if="booking.status === 'confirmed'"
          :cancellable="canCancelFree(booking, new Date())"
          :loading="status === 'cancelling'"
          @cancel="manage.cancel"
        />
        <p v-if="error === 'cancel-failed'" class="my-booking__error" role="alert">
          {{ t('myBooking.cancelFailed') }}
        </p>
      </article>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { BookingSummary, canCancelFree } from 'src/entities/booking'
import { useFormatMoney } from 'src/entities/hotel'
import {
  BookingLookupForm,
  CancelBookingButton,
  useManageBookingStore,
} from 'src/features/manage-booking'

const { t } = useI18n()
const route = useRoute()
const formatMoney = useFormatMoney()
const manage = useManageBookingStore()
const { booking, cancellation, status, error } = storeToRefs(manage)

const queryValue = (key: string) => {
  const value = route.query[key]
  return typeof value === 'string' ? value : ''
}

onMounted(() => {
  if (queryValue('id') && queryValue('email'))
    void manage.lookup(queryValue('id'), queryValue('email'))
})
</script>

<style scoped lang="scss">
.my-booking {
  padding-block: clamp(2.5rem, 7vw, 5rem) var(--space-section);

  &__inner {
    display: grid;
    gap: 1.25rem;
    max-width: 44rem;
  }

  &__title {
    font-size: var(--fs-h2);
  }

  &__lede {
    font-size: var(--fs-lead);
    color: var(--c-tarmac-soft);
  }

  &__error {
    font-weight: 600;
    color: #8a1c14;
  }

  &__card {
    display: grid;
    gap: 1.25rem;
    padding: clamp(1.25rem, 3vw, 2rem);
    background: var(--c-white);
    border-top: 6px solid var(--c-tarmac);
    border-radius: var(--radius-sign);
  }

  &__head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;

    h2 {
      font-size: var(--fs-h3);
    }
  }

  &__status {
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sign);
    font-weight: 700;
    font-size: var(--fs-small);
    background: var(--c-concrete);

    &--confirmed {
      background: #e3f1e8;
      color: #1f5c39;
    }

    &--cancelled {
      background: #fbe9e7;
      color: #8a1c14;
    }
  }

  &__done {
    font-weight: 600;
  }
}
</style>
