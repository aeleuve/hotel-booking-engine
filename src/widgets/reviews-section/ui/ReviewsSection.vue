<template>
  <section v-if="reviews" id="reviews" class="page-section" aria-labelledby="reviews-title">
    <div class="container reviews">
      <div class="reviews__score">
        <h2 id="reviews-title" class="reviews__title">{{ t('reviews.title') }}</h2>
        <p class="reviews__number" :aria-label="t('reviews.score', { score: formattedScore })">
          {{ formattedScore }}<span aria-hidden="true">/10</span>
        </p>
        <p class="reviews__count">{{ t('reviews.count', { count: formattedCount }) }}</p>
      </div>
      <div class="reviews__quotes">
        <ReviewQuoteCard v-for="quote in reviews.quotes" :key="quote.id" :quote="quote" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ReviewQuoteCard, useHotelStore } from 'src/entities/hotel'

const { t, locale } = useI18n()
const { reviews } = storeToRefs(useHotelStore())

const formattedScore = computed(() =>
  new Intl.NumberFormat(locale.value, { minimumFractionDigits: 1 }).format(
    reviews.value?.score ?? 0,
  ),
)
const formattedCount = computed(() =>
  new Intl.NumberFormat(locale.value).format(reviews.value?.count ?? 0),
)
</script>

<style scoped lang="scss">
.reviews {
  display: grid;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2.5fr;
    gap: 5rem;
  }

  &__title {
    font-size: var(--fs-h2);
    margin-bottom: 1.5rem;
  }

  &__number {
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: clamp(4rem, 10vw, 6rem);
    line-height: 1;
    font-variant-numeric: tabular-nums;

    span {
      font-size: 0.35em;
      color: var(--c-tarmac-soft);
    }
  }

  &__count {
    margin-top: 0.5rem;
    color: var(--c-tarmac-soft);
  }

  &__quotes {
    display: grid;
    gap: 2.5rem;

    @media (min-width: 700px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }
}
</style>
