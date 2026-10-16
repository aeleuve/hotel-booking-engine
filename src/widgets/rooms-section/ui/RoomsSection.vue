<template>
  <section id="rooms" class="page-section" aria-labelledby="rooms-title">
    <div class="container">
      <SectionHeader title-id="rooms-title" :title="t('rooms.title')" :lede="t('rooms.lede')" />
      <div class="rooms-grid">
        <RoomCard v-for="room in rooms" :key="room.id" :room="room" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RoomCard, useHotelStore } from 'src/entities/hotel'
import { SectionHeader } from 'src/shared/ui'

const { t } = useI18n()
const { rooms } = storeToRefs(useHotelStore())
</script>

<style scoped lang="scss">
.rooms-grid {
  display: grid;
  gap: 3rem 2rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
