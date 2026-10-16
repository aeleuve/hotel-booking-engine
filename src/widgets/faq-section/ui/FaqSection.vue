<template>
  <section id="faq" class="page-section faq" aria-labelledby="faq-title">
    <div class="container faq__layout">
      <SectionHeader title-id="faq-title" :title="t('faq.title')" />
      <FaqList :items="items" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MessageSchema } from 'src/shared/i18n'
import { FaqList, SectionHeader, type FaqEntry } from 'src/shared/ui'

const { t, tm, rt } = useI18n<{ message: MessageSchema }>()
const items = computed<FaqEntry[]>(() =>
  (tm('faq.items') as unknown as FaqEntry[]).map(({ q, a }) => ({ q: rt(q), a: rt(a) })),
)
</script>

<style scoped lang="scss">
.faq {
  background: var(--c-white);

  &__layout {
    display: grid;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 2fr;
      gap: 5rem;
    }
  }
}
</style>
