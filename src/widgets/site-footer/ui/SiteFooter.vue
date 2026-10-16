<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        <span class="site-footer__mark" aria-hidden="true">7</span>
        <span>Hotel Pista Siete</span>
      </div>
      <div v-if="profile">
        <h2 class="site-footer__heading">{{ t('footer.contact') }}</h2>
        <address class="site-footer__list">
          <span>{{ profile.address }}</span>
          <a :href="`tel:${profile.phone.replace(/\s/g, '')}`">{{ profile.phone }}</a>
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
        </address>
      </div>
      <div>
        <h2 class="site-footer__heading">{{ t('footer.legal') }}</h2>
        <div class="site-footer__list">
          <a href="#privacy">{{ t('footer.privacy') }}</a>
          <a href="#cookies">{{ t('footer.cookies') }}</a>
        </div>
      </div>
    </div>
    <p class="container site-footer__notice">{{ t('footer.notice', { year }) }}</p>
  </footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useHotelStore } from 'src/entities/hotel'

const { t } = useI18n()
const { profile } = storeToRefs(useHotelStore())
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.site-footer {
  padding-block: 4rem 2rem;
  background: var(--c-tarmac);
  color: var(--c-white);

  a {
    color: inherit;
  }

  &__grid {
    display: grid;
    gap: 2.5rem;

    @media (min-width: 700px) {
      grid-template-columns: 2fr 1.5fr 1fr;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: 1.375rem;
  }

  &__mark {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-sign);
    background: var(--c-signal);
    color: var(--c-tarmac);
  }

  &__heading {
    margin-bottom: 0.75rem;
    font-size: var(--fs-body);
    font-stretch: 100%;
    letter-spacing: 0;
    color: var(--c-signal);
  }

  &__list {
    display: grid;
    gap: 0.375rem;
    font-style: normal;
  }

  &__notice {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgb(255 255 255 / 0.15);
    font-size: var(--fs-small);
    color: rgb(255 255 255 / 0.7);
  }
}
</style>
