<template>
  <div class="pictogram-item">
    <SignPictogram :icon="icon" />
    <div>
      <h3 class="pictogram-item__title">{{ title }}</h3>
      <p class="pictogram-item__text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import SignPictogram from '../atoms/SignPictogram.vue'

defineProps<{ icon: string; title: string; text: string }>()
</script>

<style scoped lang="scss">
.pictogram-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  &__title {
    font-size: var(--fs-body);
    font-stretch: 100%;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1.3;
    margin-bottom: 0.25rem;
  }

  &__text {
    color: var(--c-tarmac-soft);
  }
}
</style>
