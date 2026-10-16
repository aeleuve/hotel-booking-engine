<template>
  <section id="services" class="page-section" aria-labelledby="services-title">
    <div class="container">
      <SectionHeader title-id="services-title" :title="t('services.title')" />
      <div class="services-grid">
        <PictogramItem
          v-for="[id, icon] in SERVICES"
          :key="id"
          :icon="icon"
          :title="t(`services.items.${id}.name`)"
          :text="t(`services.items.${id}.text`)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PictogramItem } from 'src/shared/ui'

const SERVICES = [
  ['shuttle', 'airport_shuttle'],
  ['breakfast', 'free_breakfast'],
  ['meetings', 'groups'],
  ['wifi', 'wifi'],
  ['pool', 'pool'],
  ['gym', 'fitness_center'],
  ['parking', 'local_parking'],
  ['restaurant', 'restaurant'],
] as const

const { t } = useI18n()
</script>

<style scoped lang="scss">
.services-grid {
  display: grid;
  gap: 2.25rem 2rem;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
