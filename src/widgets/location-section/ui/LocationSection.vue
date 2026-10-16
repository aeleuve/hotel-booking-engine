<template>
  <section id="location" class="page-section location" aria-labelledby="location-title">
    <div class="container location__layout">
      <div>
        <SectionHeader
          title-id="location-title"
          :title="t('location.title')"
          :lede="t('location.lede')"
        />
        <ul class="location__distances">
          <li v-for="[id, icon, minutes] in DISTANCES" :key="id">
            <SignPictogram :icon="icon" />
            <span class="location__place">{{ t(`location.distances.${id}`) }}</span>
            <span class="location__minutes">{{ t('location.minutes', { n: minutes }) }}</span>
          </li>
        </ul>

        <template v-if="profile">
          <h3 class="location__shuttle-title">{{ t('location.shuttleTitle') }}</h3>
          <ol class="location__departures">
            <li v-for="time in profile.shuttleDepartures" :key="time">
              <time :datetime="time">{{ time }}</time>
            </li>
          </ol>
          <p class="location__note">{{ t('location.shuttleNote') }}</p>
        </template>
      </div>

      <div v-if="profile" class="location__map">
        <iframe :src="mapEmbedUrl" :title="t('location.mapTitle')" loading="lazy" />
        <p class="location__address">
          {{ profile.address }}
          <a :href="mapLinkUrl" target="_blank" rel="noopener">{{ t('location.openMap') }}</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHotelStore } from 'src/entities/hotel'
import { SectionHeader, SignPictogram } from 'src/shared/ui'

const DISTANCES = [
  ['t4', 'flight', 6],
  ['ifema', 'storefront', 8],
  ['t12', 'flight', 9],
  ['centre', 'location_city', 20],
] as const

const MAP_SPAN = 0.025

const { t } = useI18n()
const { profile } = storeToRefs(useHotelStore())

const mapEmbedUrl = computed(() => {
  if (!profile.value) return ''
  const { latitude: lat, longitude: lon } = profile.value.location
  const bbox = [lon - MAP_SPAN, lat - MAP_SPAN, lon + MAP_SPAN, lat + MAP_SPAN].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
})

const mapLinkUrl = computed(() => {
  const { latitude, longitude } = profile.value?.location ?? { latitude: 0, longitude: 0 }
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`
})
</script>

<style scoped lang="scss">
.location {
  background: var(--c-white);

  &__layout {
    display: grid;
    gap: 3rem;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
    }
  }

  &__distances {
    display: grid;
    margin: 0 0 3rem;
    padding: 0;
    list-style: none;
    border-top: 2px solid var(--c-tarmac);

    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-block: 0.875rem;
      border-bottom: 1px solid var(--c-concrete-deep);
    }
  }

  &__place {
    flex: 1;
    font-weight: 600;
  }

  &__minutes {
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: var(--fs-h3);
    font-variant-numeric: tabular-nums;
  }

  &__shuttle-title {
    margin-bottom: 1rem;
    font-size: var(--fs-lead);
    font-stretch: 100%;
    letter-spacing: 0;
  }

  &__departures {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;

    li {
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-sign);
      background: var(--c-tarmac);
      color: var(--c-white);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  }

  &__note {
    max-width: 52ch;
    color: var(--c-tarmac-soft);
  }

  &__map {
    display: grid;
    gap: 1rem;
    align-content: start;

    iframe {
      width: 100%;
      aspect-ratio: 1;
      max-height: 32rem;
      border: 0;
      border-radius: var(--radius-sign);
      background: var(--c-concrete);
    }
  }

  &__address {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem 1rem;
    font-weight: 600;
  }
}
</style>
