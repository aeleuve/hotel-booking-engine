<template>
  <section id="rooms" class="page-section" aria-labelledby="rooms-title">
    <div class="container">
      <SectionHeader title-id="rooms-title" :title="t('rooms.title')" :lede="t('rooms.lede')" />
      <div class="rooms-grid">
        <RoomCard v-for="room in visibleRooms" :key="room.id" :room="room" />
      </div>
      <div class="rooms-actions">
        <q-btn
          v-if="rooms.length > COLLAPSED_ROOMS"
          flat
          no-caps
          color="primary"
          :label="expanded ? t('rooms.showLess') : t('rooms.showAll', { n: rooms.length })"
          @click="expanded = !expanded"
        />
        <q-btn
          unelevated
          no-caps
          color="secondary"
          href="/#booking"
          :label="t('rooms.checkPrices')"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RoomCard, useHotelStore } from 'src/entities/hotel'
import { SectionHeader } from 'src/shared/ui'

const COLLAPSED_ROOMS = 6

const { t } = useI18n()
const { rooms } = storeToRefs(useHotelStore())
const expanded = ref(false)
const visibleRooms = computed(() =>
  expanded.value ? rooms.value : rooms.value.slice(0, COLLAPSED_ROOMS),
)
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

.rooms-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 3rem;
  font-weight: 700;
}
</style>
