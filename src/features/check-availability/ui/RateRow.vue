<template>
  <li class="rate-row">
    <div class="rate-row__terms">
      <span class="rate-row__board">
        <q-icon :name="offer.board.code === 'RO' ? 'hotel' : 'free_breakfast'" aria-hidden="true" />
        {{ offer.board.name }}
      </span>
      <span class="rate-row__policy" :class="{ 'rate-row__policy--free': offer.refundable }">{{
        policy
      }}</span>
    </div>
    <div class="rate-row__price">
      <span class="rate-row__total">{{ formatMoney(offer.total) }}</span>
      <span class="rate-row__note">
        {{ t('rates.forNights', { n: nights }, nights) }}
        <template v-if="offer.payAtHotel"
          >, {{ t('rates.payAtHotel', { amount: formatMoney(offer.payAtHotel) }) }}</template
        >
      </span>
    </div>
    <q-btn
      unelevated
      no-caps
      color="secondary"
      :label="t('rates.reserve')"
      class="rate-row__cta"
      @click="emit('reserve', offer)"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatMoney, type RateOffer } from 'src/entities/hotel'
import { formatDateTime } from 'src/shared/lib/date'

const props = defineProps<{ offer: RateOffer; nights: number }>()
const emit = defineEmits<{ reserve: [offer: RateOffer] }>()
const { t, locale } = useI18n()
const formatMoney = useFormatMoney()

const policy = computed(() => {
  const { refundable, freeCancellationUntil } = props.offer
  if (!refundable) return t('rates.nonRefundable')
  if (!freeCancellationUntil) return t('rates.freeCancellation')
  return t('rates.freeUntil', { date: formatDateTime(freeCancellationUntil, locale.value) })
})
</script>

<style scoped lang="scss">
.rate-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem 1.5rem;
  align-items: center;
  padding-block: 1rem;
  border-top: 1px solid var(--c-concrete-deep);

  @media (min-width: 700px) {
    grid-template-columns: 1fr auto auto;
  }

  &__terms {
    display: grid;
    gap: 0.125rem;
  }

  &__board {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 700;
  }

  &__policy {
    font-size: var(--fs-small);
    color: var(--c-tarmac-soft);

    &--free {
      color: #2e7d4f;
      font-weight: 600;
    }
  }

  &__price {
    display: grid;
    text-align: right;
  }

  &__total {
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: var(--fs-lead);
    font-variant-numeric: tabular-nums;
  }

  &__note {
    font-size: var(--fs-small);
    color: var(--c-tarmac-soft);
  }

  &__cta {
    grid-column: 1 / -1;
    font-weight: 700;

    @media (min-width: 700px) {
      grid-column: auto;
    }
  }
}
</style>
