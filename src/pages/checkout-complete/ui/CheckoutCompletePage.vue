<template>
  <q-page class="complete">
    <div class="container complete__inner">
      <p
        v-if="status === 'confirming' || status === 'idle'"
        class="complete__state"
        aria-live="polite"
      >
        <q-spinner size="1.5rem" /> {{ t('complete.confirming') }}
      </p>

      <template v-else-if="status === 'confirmed' && booking">
        <SignPictogram icon="check" tone="signal" class="complete__mark" />
        <h1 class="complete__title">{{ t('complete.title') }}</h1>
        <p class="complete__email">
          {{ t('complete.emailSent', { email: booking.holder.email }) }}
        </p>
        <dl class="complete__codes">
          <div>
            <dt>{{ t('complete.bookingId') }}</dt>
            <dd class="complete__code">{{ booking.bookingId }}</dd>
          </div>
          <div>
            <dt>{{ t('complete.confirmationCode') }}</dt>
            <dd>{{ booking.confirmationCode ?? t('complete.pendingCode') }}</dd>
          </div>
        </dl>
        <div class="complete__card">
          <p class="complete__hotel">{{ booking.hotelName }}</p>
          <BookingSummary
            :check-in="booking.checkIn"
            :check-out="booking.checkOut"
            :rooms="booking.rooms"
            :price="booking.price"
            :refundable="booking.refundable"
            :free-cancellation-until="booking.freeCancellationUntil"
          />
        </div>
        <q-btn
          unelevated
          no-caps
          color="secondary"
          :to="{
            name: 'my-booking',
            query: { id: booking.bookingId, email: booking.holder.email },
          }"
          :label="t('complete.manage')"
          class="complete__cta"
        />
      </template>

      <template v-else>
        <h1 class="complete__title">{{ t('complete.failedTitle') }}</h1>
        <p role="alert">{{ t(`checkout.errors.${error ?? 'session-lost'}`) }}</p>
        <q-btn
          unelevated
          no-caps
          color="secondary"
          to="/"
          :label="t('complete.backHome')"
          class="complete__cta"
        />
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { BookingSummary } from 'src/entities/booking'
import { useCheckoutStore } from 'src/features/checkout'
import { SignPictogram } from 'src/shared/ui'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const checkout = useCheckoutStore()
const { status, booking, error } = storeToRefs(checkout)

const queryValue = (key: string) => {
  const value = route.query[key]
  return typeof value === 'string' ? value : ''
}

/** Drops the payment provider's extra params (client secret) from the address bar. */
const keepOnlyCheckoutParams = (pid: string, tid: string) => router.replace({ query: { pid, tid } })

onMounted(async () => {
  const [pid, tid] = [queryValue('pid'), queryValue('tid')]
  await keepOnlyCheckoutParams(pid, tid)
  await checkout.complete(pid, tid)
})
</script>

<style scoped lang="scss">
.complete {
  padding-block: clamp(2.5rem, 7vw, 5rem) var(--space-section);

  &__inner {
    display: grid;
    gap: 1.25rem;
    justify-items: start;
    max-width: 44rem;
  }

  &__state {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
  }

  &__mark {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 2rem;
  }

  &__title {
    font-size: var(--fs-h2);
  }

  &__email {
    font-size: var(--fs-lead);
    color: var(--c-tarmac-soft);
  }

  &__codes {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 3rem;
    margin: 0;

    dt {
      font-size: var(--fs-small);
      font-weight: 700;
    }

    dd {
      margin: 0;
      font-weight: 600;
    }
  }

  &__code {
    font-stretch: var(--wide);
    font-weight: 800 !important;
    font-size: var(--fs-h3);
    letter-spacing: 0.04em;
  }

  &__card {
    width: 100%;
    padding: clamp(1.25rem, 3vw, 2rem);
    background: var(--c-white);
    border-top: 6px solid var(--c-tarmac);
    border-radius: var(--radius-sign);
  }

  &__hotel {
    margin-bottom: 1rem;
    font-weight: 700;
  }

  &__cta {
    font-weight: 700;
  }
}
</style>
