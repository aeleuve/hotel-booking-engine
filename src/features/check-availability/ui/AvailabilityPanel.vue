<template>
  <section
    v-if="result"
    class="availability"
    aria-live="polite"
    :aria-label="t('availability.direct')"
  >
    <p class="availability__summary">
      {{ formatDate(result.query.checkIn) }} – {{ formatDate(result.query.checkOut) }},
      {{ t('availability.summary', { nights: result.nights, guests: guestCount }, result.nights) }}
    </p>

    <template v-if="direct">
      <div class="availability__direct">
        <div>
          <p class="availability__label">{{ t('availability.direct') }}</p>
          <p class="availability__price">{{ formatMoney(direct) }}</p>
          <p class="availability__taxes">{{ t('availability.taxes') }}</p>
        </div>
        <q-btn
          unelevated
          no-caps
          color="primary"
          size="lg"
          icon-right="mail"
          :href="bookingMailto"
          :label="t('availability.book')"
        />
      </div>
      <h3 class="availability__compare-title">{{ t('availability.compare') }}</h3>
      <ul class="availability__rates">
        <li v-for="rate in pricedRates" :key="rate.vendor">
          <span>{{ rate.vendor }}</span>
          <s>{{ formatMoney(rate.total!) }}</s>
        </li>
      </ul>
    </template>

    <p v-else class="availability__unpriced">
      <i18n-t keypath="availability.unpriced" scope="global">
        <template #phone>
          <a :href="`tel:${phone.replace(/\s/g, '')}`">{{ phone }}</a>
        </template>
      </i18n-t>
    </p>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { directPrice, useFormatMoney } from 'src/entities/hotel'
import { useAvailabilityStore } from '../model/availability-store'

const props = defineProps<{ phone: string; email: string }>()
const { t, locale } = useI18n()
const formatMoney = useFormatMoney()
const { result } = storeToRefs(useAvailabilityStore())

const direct = computed(() => (result.value ? directPrice(result.value) : null))
const pricedRates = computed(() => result.value?.rates.filter((rate) => rate.total) ?? [])
const guestCount = computed(() =>
  result.value ? result.value.query.adults + result.value.query.children : 0,
)

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  )

const bookingMailto = computed(() => {
  if (!result.value || !direct.value) return ''
  const { query } = result.value
  const subject = `${query.checkIn} – ${query.checkOut}, ${formatMoney(direct.value)}`
  const body = [subject, t('booking.guestSummary', { ...query }, query.rooms)].join('\n')
  return `mailto:${props.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})
</script>

<style scoped lang="scss">
.availability {
  display: grid;
  gap: 1.25rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--c-white);
  border-radius: var(--radius-sign);

  &__summary {
    font-weight: 600;
    color: var(--c-tarmac-soft);
  }

  &__direct {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 2px solid var(--c-tarmac);
  }

  &__label {
    font-weight: 700;
  }

  &__price {
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: var(--fs-h2);
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  &__taxes {
    font-size: var(--fs-small);
    color: var(--c-tarmac-soft);
  }

  &__compare-title {
    font-size: var(--fs-body);
    font-stretch: 100%;
    letter-spacing: 0;
  }

  &__rates {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 0.5rem 2rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      color: var(--c-tarmac-soft);
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
