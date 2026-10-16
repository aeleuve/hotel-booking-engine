<template>
  <figure class="review-quote">
    <blockquote class="review-quote__text" :lang="quote.language">{{ quote.text }}</blockquote>
    <figcaption class="review-quote__author">
      <span>{{ quote.author }}, {{ quote.country }}</span>
      <span class="review-quote__score">{{ t('reviews.score', { score: quote.score }) }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ReviewQuote } from '../model/types'

defineProps<{ quote: ReviewQuote }>()
const { t } = useI18n()
</script>

<style scoped lang="scss">
.review-quote {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 0;

  &__text {
    margin: 0;
    font-size: var(--fs-lead);
    line-height: 1.45;
  }

  &__author {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid var(--c-concrete-deep);
    font-size: var(--fs-small);
    font-weight: 600;
  }

  &__score {
    color: var(--c-tarmac-soft);
    font-variant-numeric: tabular-nums;
  }
}
</style>
