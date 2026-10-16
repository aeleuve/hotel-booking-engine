<template>
  <section id="offers" class="page-section offers" aria-labelledby="offers-title">
    <div class="container offers__layout">
      <div>
        <SectionHeader
          title-id="offers-title"
          :title="t('offers.title')"
          :lede="t('offers.lede')"
        />
        <OfferCard v-for="offer in offers" :key="offer.id" :offer="offer" />
      </div>
      <aside class="offers__benefits" aria-labelledby="benefits-title">
        <h3 id="benefits-title" class="offers__benefits-title">{{ t('offers.benefitsTitle') }}</h3>
        <ul>
          <li v-for="(benefit, index) in benefits" :key="index">
            <q-icon name="check" aria-hidden="true" />
            <span>{{ benefit }}</span>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { OfferCard, useHotelStore } from 'src/entities/hotel'
import type { MessageSchema } from 'src/shared/i18n'
import { SectionHeader } from 'src/shared/ui'

const { t, tm, rt } = useI18n<{ message: MessageSchema }>()
const { offers } = storeToRefs(useHotelStore())
const benefits = computed(() =>
  (tm('offers.benefits') as unknown as string[]).map((item) => rt(item)),
)
</script>

<style scoped lang="scss">
.offers {
  background: var(--c-white);

  &__layout {
    display: grid;
    gap: 3rem;

    @media (min-width: 1024px) {
      grid-template-columns: 1.6fr 1fr;
      gap: 5rem;
      align-items: start;
    }
  }

  &__benefits {
    padding: 2rem;
    background: var(--c-concrete);
    border-left: 6px solid var(--c-runway);

    @media (min-width: 1024px) {
      position: sticky;
      top: 8rem;
    }

    ul {
      display: grid;
      gap: 1rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .q-icon {
      flex: none;
      margin-top: 0.15rem;
      font-size: 1.25rem;
      color: var(--c-runway);
    }
  }

  &__benefits-title {
    margin-bottom: 1.25rem;
    font-size: var(--fs-h3);
  }
}
</style>
