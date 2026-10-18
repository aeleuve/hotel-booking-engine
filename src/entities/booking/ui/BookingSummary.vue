<template>
  <dl class="booking-summary">
    <div>
      <dt>{{ t('summary.dates') }}</dt>
      <dd>{{ formatDay(checkIn, locale) }} – {{ formatDay(checkOut, locale) }}</dd>
    </div>
    <div v-for="(room, index) in rooms" :key="index">
      <dt>{{ t('summary.room') }}</dt>
      <dd>
        {{ room.name }}<span v-if="room.board">, {{ room.board }}</span>
      </dd>
    </div>
    <div>
      <dt>{{ t('summary.cancellation') }}</dt>
      <dd>{{ cancellationText }}</dd>
    </div>
    <div class="booking-summary__total">
      <dt>{{ t('summary.total') }}</dt>
      <dd>{{ formatMoney(price) }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatMoney, type IsoTimestamp, type Money } from 'src/entities/hotel'
import { formatDateTime, formatDay } from 'src/shared/lib/date'

export interface SummaryRoom {
  name: string
  board: string
}

/** Dates, rooms, cancellation terms and total of a stay being booked or already booked. */
const props = defineProps<{
  checkIn: string
  checkOut: string
  rooms: SummaryRoom[]
  price: Money
  refundable: boolean
  freeCancellationUntil: IsoTimestamp | null
}>()

const { t, locale } = useI18n()
const formatMoney = useFormatMoney()

const cancellationText = computed(() => {
  if (!props.refundable) return t('rates.nonRefundable')
  if (!props.freeCancellationUntil) return t('rates.freeCancellation')
  return t('rates.freeUntil', { date: formatDateTime(props.freeCancellationUntil, locale.value) })
})
</script>

<style scoped lang="scss">
.booking-summary {
  display: grid;
  gap: 0.75rem;
  margin: 0;

  div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--c-concrete-deep);
  }

  dt {
    color: var(--c-tarmac-soft);
  }

  dd {
    margin: 0;
    font-weight: 600;
    text-align: right;
  }

  &__total {
    border-bottom: 0 !important;

    dd {
      font-stretch: var(--wide);
      font-weight: 800;
      font-size: var(--fs-h3);
    }
  }
}
</style>
