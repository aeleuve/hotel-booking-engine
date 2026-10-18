<template>
  <q-page class="checkout">
    <div v-if="pending" class="container checkout__inner">
      <router-link to="/#availability" class="checkout__back">
        <q-icon name="arrow_back" aria-hidden="true" /> {{ t('checkout.back') }}
      </router-link>
      <h1 class="checkout__title">{{ t('checkout.title') }}</h1>
      <div class="checkout__layout">
        <ol class="checkout__steps">
          <li class="checkout__step">
            <h2>{{ t('checkout.guestStep') }}</h2>
            <GuestForm
              :initial="pending.holder ?? emptyGuest()"
              :loading="status === 'holding'"
              @submit="checkout.hold"
            />
          </li>
          <li v-if="pending.session" class="checkout__step">
            <h2>{{ t('checkout.paymentStep') }}</h2>
            <PaymentStep
              :key="pending.session.prebookId"
              :session="pending.session"
              @ready="mountPayment"
            />
          </li>
        </ol>
        <aside class="checkout__summary">
          <p class="checkout__hotel">{{ profile?.propertyName }}</p>
          <BookingSummary
            :check-in="pending.query.checkIn"
            :check-out="pending.query.checkOut"
            :rooms="[{ name: roomName, board: pending.offer.board.name }]"
            :price="pending.session?.price ?? pending.offer.total"
            :refundable="pending.offer.refundable"
            :free-cancellation-until="pending.offer.freeCancellationUntil"
          />
        </aside>
      </div>
      <q-banner v-if="error" rounded class="checkout__error" role="alert">
        {{ t(`checkout.errors.${error}`) }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BookingSummary } from 'src/entities/booking'
import { useHotelStore } from 'src/entities/hotel'
import { emptyGuest, GuestForm, PaymentStep, useCheckoutStore } from 'src/features/checkout'

const { t } = useI18n()
const router = useRouter()
const checkout = useCheckoutStore()
const { pending, status, error } = storeToRefs(checkout)
const { profile, rooms } = storeToRefs(useHotelStore())

const roomName = computed(() => {
  const offer = pending.value?.offer
  return rooms.value.find(({ id }) => id === offer?.roomId)?.name ?? offer?.name ?? ''
})

onMounted(() => {
  if (!pending.value) void router.replace({ path: '/', hash: '#booking' })
})

const mountPayment = () => {
  const session = pending.value?.session
  if (!session) return
  const target = router.resolve({
    name: 'checkout-complete',
    query: { pid: session.prebookId, tid: session.transactionId },
  })
  void checkout.mountPayment({
    returnUrl: new URL(target.href, window.location.origin).href,
    businessName: profile.value?.name ?? '',
    payLabel: t('checkout.payTest'),
  })
}
</script>

<style scoped lang="scss">
.checkout {
  padding-block: clamp(2rem, 6vw, 4rem) var(--space-section);

  &__inner {
    display: grid;
    gap: 1.5rem;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
  }

  &__title {
    font-size: var(--fs-h2);
  }

  &__layout {
    display: grid;
    gap: 2rem;
    align-items: start;

    @media (min-width: 1024px) {
      grid-template-columns: 1.6fr 1fr;
      gap: 4rem;
    }
  }

  &__steps {
    display: grid;
    gap: 2rem;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: step;
  }

  &__step {
    counter-increment: step;
    padding: clamp(1.25rem, 3vw, 2rem);
    background: var(--c-white);
    border-radius: var(--radius-sign);

    h2 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      font-size: var(--fs-h3);

      &::before {
        content: counter(step);
        display: inline-grid;
        place-items: center;
        width: 2rem;
        height: 2rem;
        border-radius: var(--radius-sign);
        background: var(--c-signal);
        font-size: 1.125rem;
      }
    }
  }

  &__summary {
    padding: clamp(1.25rem, 3vw, 2rem);
    background: var(--c-white);
    border-top: 6px solid var(--c-tarmac);
    border-radius: var(--radius-sign);

    @media (min-width: 1024px) {
      position: sticky;
      top: 8rem;
    }
  }

  &__hotel {
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: var(--fs-lead);
  }

  &__error {
    background: #fbe9e7;
    color: #8a1c14;
    font-weight: 600;
  }
}
</style>
