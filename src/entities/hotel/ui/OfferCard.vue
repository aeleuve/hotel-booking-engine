<template>
  <article class="offer-card">
    <img
      class="offer-card__image"
      :src="offer.imageUrl"
      alt=""
      loading="lazy"
      width="900"
      height="600"
    />
    <div class="offer-card__body">
      <p class="offer-card__discount">{{ t('offers.off', { n: offer.discountPercent }) }}</p>
      <h3 class="offer-card__name">{{ t(`offers.items.${offer.id}.name`) }}</h3>
      <p class="offer-card__text">{{ t(`offers.items.${offer.id}.text`) }}</p>
      <p class="offer-card__price">
        {{ t('offers.from', { price: formatMoney(offer.fromPrice) }) }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Offer } from '../model/types'
import { useFormatMoney } from '../model/use-format-money'

defineProps<{ offer: Offer }>()
const { t } = useI18n()
const formatMoney = useFormatMoney()
</script>

<style scoped lang="scss">
.offer-card {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1.25rem;
  align-items: start;
  padding-block: 1.5rem;
  border-bottom: 1px solid var(--c-concrete-deep);

  @media (min-width: 600px) {
    grid-template-columns: 11rem 1fr;
  }

  &__image {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: var(--radius-sign);
  }

  &__body {
    display: grid;
    gap: 0.25rem;
  }

  &__discount {
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: var(--fs-h3);
    line-height: 1.1;
    color: var(--c-runway);
  }

  &__name {
    font-size: var(--fs-lead);
    font-stretch: 100%;
    letter-spacing: 0;
  }

  &__text {
    color: var(--c-tarmac-soft);
  }

  &__price {
    font-weight: 700;
    margin-top: 0.25rem;
  }
}
</style>
