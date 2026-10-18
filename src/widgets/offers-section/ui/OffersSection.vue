<template>
  <section id="offers" class="page-section benefits" aria-labelledby="offers-title">
    <div class="container">
      <SectionHeader title-id="offers-title" :title="t('offers.title')" :lede="t('offers.lede')" />
      <ul class="benefits__list">
        <li v-for="(benefit, index) in benefits" :key="index">
          <q-icon name="check" aria-hidden="true" />
          <span>{{ benefit }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MessageSchema } from 'src/shared/i18n'
import { SectionHeader } from 'src/shared/ui'

const { t, tm, rt } = useI18n<{ message: MessageSchema }>()
const benefits = computed(() =>
  (tm('offers.benefits') as unknown as string[]).map((item) => rt(item)),
)
</script>

<style scoped lang="scss">
.benefits {
  background: var(--c-white);

  &__list {
    display: grid;
    gap: 1.25rem 3rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--fs-lead);

    @media (min-width: 800px) {
      grid-template-columns: 1fr 1fr;
    }

    li {
      display: flex;
      gap: 0.875rem;
      align-items: flex-start;
      padding-top: 1rem;
      border-top: 2px solid var(--c-tarmac);
    }

    .q-icon {
      flex: none;
      margin-top: 0.2rem;
      color: var(--c-runway);
    }
  }
}
</style>
