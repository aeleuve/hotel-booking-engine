<template>
  <div class="payment-step">
    <q-banner
      v-if="session.priceChanged || session.termsChanged"
      rounded
      class="payment-step__notice"
    >
      <template #avatar><q-icon name="info" color="primary" /></template>
      {{
        session.priceChanged
          ? t('checkout.priceChanged', { price: formatMoney(session.price) })
          : t('checkout.termsChanged')
      }}
    </q-banner>
    <p class="payment-step__total">
      {{ t('checkout.payNow', { price: formatMoney(session.price) }) }}
    </p>
    <div id="payment-target" class="payment-step__target" />
    <p class="payment-step__secure">
      <q-icon name="lock" aria-hidden="true" /> {{ t('checkout.secure') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CheckoutSession } from 'src/entities/booking'
import { useFormatMoney } from 'src/entities/hotel'

defineProps<{ session: CheckoutSession }>()
const emit = defineEmits<{ ready: [] }>()
const { t } = useI18n()
const formatMoney = useFormatMoney()

onMounted(() => emit('ready'))
</script>

<style scoped lang="scss">
.payment-step {
  display: grid;
  gap: 1rem;

  &__notice {
    background: var(--c-concrete);
  }

  &__total {
    font-weight: 700;
    font-size: var(--fs-lead);
  }

  &__target {
    min-height: 12rem;

    :deep(.mock-payment__button) {
      padding: 0.875rem 1.5rem;
      border: 0;
      border-radius: var(--radius-sign);
      background: var(--c-tarmac);
      color: var(--c-signal);
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }
  }

  &__secure {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: var(--fs-small);
    color: var(--c-tarmac-soft);
  }
}
</style>
