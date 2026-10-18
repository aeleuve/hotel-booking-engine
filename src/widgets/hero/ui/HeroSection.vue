<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <img
      v-if="profile"
      class="hero__image"
      :src="profile.heroImageUrl"
      alt=""
      fetchpriority="high"
      width="2000"
      height="1333"
    />
    <div class="container hero__content">
      <p v-if="profile" class="hero__stars">
        <span class="visually-hidden">{{ t('hero.stars', { n: profile.stars }) }}</span>
        <q-icon v-for="star in profile.stars" :key="star" name="star" aria-hidden="true" />
      </p>
      <h1 id="hero-title" class="hero__title">{{ t('hero.title') }}</h1>
      <p class="hero__lede">{{ t('hero.lede') }}</p>
    </div>
    <div id="booking" class="container hero__booking">
      <BookingSign />
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useHotelStore } from 'src/entities/hotel'
import { BookingSign } from 'src/features/check-availability'

const { t } = useI18n()
const { profile } = storeToRefs(useHotelStore())
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  display: grid;
  isolation: isolate;
  padding-top: clamp(6rem, 18vh, 11rem);

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 6rem;
    z-index: -1;
    background: linear-gradient(
      100deg,
      rgb(20 24 28 / 0.82) 0%,
      rgb(20 24 28 / 0.45) 55%,
      rgb(20 24 28 / 0.1) 100%
    );
  }

  &__image {
    position: absolute;
    inset: 0 0 6rem;
    z-index: -2;
    width: 100%;
    height: calc(100% - 6rem);
    object-fit: cover;
    background: var(--c-tarmac);
  }

  &__content {
    display: grid;
    gap: 1.25rem;
    padding-bottom: clamp(3rem, 8vh, 5rem);
    color: var(--c-white);
  }

  &__stars {
    display: flex;
    gap: 0.125rem;
    color: var(--c-signal);
    font-size: 1.125rem;
  }

  &__title {
    max-width: 11em;
    font-size: var(--fs-h1);
    line-height: 0.98;
    text-wrap: balance;
  }

  &__lede {
    max-width: 36rem;
    font-size: var(--fs-lead);
    line-height: 1.45;
    color: rgb(255 255 255 / 0.9);
  }

  &__booking {
    display: grid;
    gap: 1rem;
  }
}
</style>
