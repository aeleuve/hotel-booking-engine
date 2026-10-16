<template>
  <article class="room-card">
    <img
      class="room-card__image"
      :src="room.imageUrl"
      :alt="name"
      loading="lazy"
      width="900"
      height="675"
    />
    <h3 class="room-card__name">{{ name }}</h3>
    <p class="room-card__text">{{ t(`rooms.items.${room.id}.text`) }}</p>
    <ul class="room-card__facts">
      <li>
        <q-icon name="square_foot" aria-hidden="true" />{{ t('rooms.size', { n: room.sizeM2 }) }}
      </li>
      <li>
        <q-icon name="group" aria-hidden="true" />{{ t('rooms.guests', { n: room.maxGuests }) }}
      </li>
      <li><q-icon name="bed" aria-hidden="true" />{{ t(`rooms.bed.${room.bed}`) }}</li>
    </ul>
    <p class="room-card__price">{{ t('rooms.from', { price: formatMoney(room.fromPrice) }) }}</p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RoomType } from '../model/types'
import { useFormatMoney } from '../model/use-format-money'

const props = defineProps<{ room: RoomType }>()
const { t } = useI18n()
const formatMoney = useFormatMoney()
const name = computed(() => t(`rooms.items.${props.room.id}.name`))
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
    margin-bottom: 0.5rem;
    background: var(--c-concrete-deep);
  }

  &__name {
    font-size: var(--fs-h3);
  }

  &__text {
    color: var(--c-tarmac-soft);
  }

  &__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
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

  &__price {
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 2px solid var(--c-tarmac);
    font-weight: 700;
  }
}
</style>
