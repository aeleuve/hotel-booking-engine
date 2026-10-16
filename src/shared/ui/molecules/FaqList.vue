<template>
  <q-list class="faq-list">
    <q-expansion-item
      v-for="item in items"
      :key="item.q"
      group="faq"
      :label="item.q"
      header-class="faq-list__question"
      expand-icon="add"
      expanded-icon="remove"
    >
      <p class="faq-list__answer">{{ item.a }}</p>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
export interface FaqEntry {
  q: string
  a: string
}

/** Accordion of question/answer pairs; one open at a time. */
defineProps<{ items: FaqEntry[] }>()
</script>

<style scoped lang="scss">
.faq-list {
  border-top: 2px solid var(--c-tarmac);

  :deep(.q-expansion-item) {
    border-bottom: 1px solid var(--c-concrete-deep);
  }

  :deep(.faq-list__question) {
    padding: 1.25rem 0;
    font-size: var(--fs-lead);
    font-weight: 700;
    line-height: 1.3;
  }

  &__answer {
    max-width: 62ch;
    padding-bottom: 1.5rem;
    color: var(--c-tarmac-soft);
  }
}
</style>
