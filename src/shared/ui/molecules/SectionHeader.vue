<template>
  <header class="section-header">
    <h2 :id="titleId" class="section-header__title">{{ title }}</h2>
    <p v-if="lede" class="section-header__lede">{{ lede }}</p>
  </header>
</template>

<script setup lang="ts">
/** Section title with optional lede. `titleId` lets the section use `aria-labelledby`. */
defineProps<{ title: string; titleId: string; lede?: string }>()
</script>

<style scoped lang="scss">
.section-header {
  display: grid;
  gap: 1rem;
  max-width: 40rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);

  &__title {
    font-size: var(--fs-h2);
  }

  &__lede {
    font-size: var(--fs-lead);
    line-height: 1.45;
    color: var(--c-tarmac-soft);
  }
}
</style>
