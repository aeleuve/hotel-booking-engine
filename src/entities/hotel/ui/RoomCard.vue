<template>
  <article class="room-card">
    <img
      v-if="room.photoUrls[0]"
      class="room-card__image"
      :src="room.photoUrls[0]"
      :alt="room.name"
      loading="lazy"
      width="900"
      height="675"
    />
    <h3 class="room-card__name">{{ room.name }}</h3>
    <ul class="room-card__facts">
      <li v-if="room.sizeM2">
        <q-icon name="square_foot" aria-hidden="true" />{{ t('rooms.size', { n: room.sizeM2 }) }}
      </li>
      <li>
        <q-icon name="group" aria-hidden="true" />{{ t('rooms.guests', { n: room.maxGuests }) }}
      </li>
      <li v-for="bed in room.beds" :key="bed"><q-icon name="bed" aria-hidden="true" />{{ bed }}</li>
    </ul>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { RoomType } from '../model/types'

defineProps<{ room: RoomType }>()
const { t } = useI18n()
</script>

<style scoped lang="scss">
.room-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__image {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--radius-sign);
    margin-bottom: 0.25rem;
    background: var(--c-concrete-deep);
  }

  &__name {
    font-size: var(--fs-h3);
  }

  &__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    margin: 0;
    padding: 0.75rem 0 0;
    list-style: none;
    border-top: 2px solid var(--c-tarmac);
    font-size: var(--fs-small);

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .q-icon {
      font-size: 1.15rem;
    }
  }
}
</style>
