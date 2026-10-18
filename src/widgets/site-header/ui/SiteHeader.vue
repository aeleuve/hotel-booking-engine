<template>
  <q-header class="site-header">
    <div class="site-header__strip">
      <div class="container site-header__strip-inner">
        <p class="site-header__official">{{ t('topBar.official') }}</p>
        <div v-if="profile" class="site-header__contact">
          <a :href="`tel:${digits(profile.phone)}`">
            <q-icon name="call" aria-hidden="true" />
            <span class="site-header__call-label">{{
              t('topBar.call', { phone: profile.phone })
            }}</span>
            <span class="site-header__call-short">{{ profile.phone }}</span>
          </a>
          <a
            :href="`https://wa.me/${digits(profile.whatsapp).slice(1)}`"
            target="_blank"
            rel="noopener"
          >
            <q-icon name="chat" aria-hidden="true" />
            <span>{{ t('topBar.whatsapp') }}</span>
          </a>
        </div>
        <LocaleSwitcher class="site-header__locale" />
      </div>
    </div>

    <div class="container site-header__bar">
      <router-link to="/" class="site-header__brand">
        <span class="site-header__mark" aria-hidden="true">7</span>
        <span>Pista Siete</span>
      </router-link>
      <nav class="site-header__nav" :aria-label="t('nav.label')">
        <a v-for="link in NAV_LINKS" :key="link" :href="`/#${link}`">{{ t(`nav.${link}`) }}</a>
        <router-link to="/my-booking">{{ t('nav.myBooking') }}</router-link>
      </nav>
      <q-btn
        unelevated
        no-caps
        color="secondary"
        href="/#booking"
        :label="t('nav.book')"
        class="site-header__cta"
      />
      <q-btn flat round icon="menu" class="site-header__menu" :aria-label="t('nav.openMenu')">
        <q-menu anchor="bottom right" self="top right" :offset="[0, 12]">
          <q-list class="site-header__menu-list">
            <q-item
              v-for="link in NAV_LINKS"
              :key="link"
              v-close-popup
              clickable
              tag="a"
              :href="`#${link}`"
            >
              <q-item-section>{{ t(`nav.${link}`) }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </q-header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useHotelStore } from 'src/entities/hotel'
import { LocaleSwitcher } from 'src/features/switch-locale'
import { NAV_LINKS } from './nav-links'

const { t } = useI18n()
const { profile } = storeToRefs(useHotelStore())
const digits = (phone: string) => phone.replace(/[^\d+]/g, '')
</script>

<style scoped lang="scss">
.site-header {
  background: var(--c-white);
  color: var(--c-tarmac);
  border-bottom: 1px solid var(--c-concrete-deep);

  &__strip {
    background: var(--c-tarmac);
    color: var(--c-white);
    font-size: var(--fs-small);
  }

  &__strip-inner {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    min-height: 2.5rem;
  }

  &__official {
    display: none;
    margin-right: auto;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  &__contact {
    display: flex;
    gap: 1.25rem;

    a {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: inherit;
      text-decoration: none;

      &:hover span {
        text-decoration: underline;
      }
    }
  }

  &__call-label {
    display: none;

    @media (min-width: 600px) {
      display: inline;
    }
  }

  &__call-short {
    @media (min-width: 600px) {
      display: none;
    }
  }

  &__locale {
    margin-left: auto;

    @media (min-width: 1024px) {
      margin-left: 0;
    }
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 2rem;
    min-height: 4rem;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    margin-right: auto;
    color: inherit;
    text-decoration: none;
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: 1.25rem;
  }

  &__mark {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-sign);
    background: var(--c-signal);
    font-size: 1.375rem;
  }

  &__nav {
    display: none;
    gap: 1.75rem;

    @media (min-width: 1024px) {
      display: flex;
    }

    a {
      color: inherit;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__cta {
    font-weight: 700;
  }

  &__menu {
    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__menu-list {
    min-width: 14rem;
    font-weight: 600;
  }
}
</style>
