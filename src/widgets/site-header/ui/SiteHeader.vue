<template>
  <q-header
    class="site-header"
    :class="{ 'site-header--immersive': isHome, 'site-header--scrolled': isHome && isScrolled }"
  >
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
        <span class="site-header__mark" aria-hidden="true"><span>7</span></span>
        <span>Pista Siete</span>
      </router-link>
      <nav class="site-header__nav" :aria-label="t('nav.label')">
        <a v-for="link in NAV_LINKS" :key="link" :href="`/#${link}`">{{ t(`nav.${link}`) }}</a>
        <router-link to="/my-booking">{{ t('nav.myBooking') }}</router-link>
      </nav>
      <q-btn
        unelevated
        no-caps
        :color="isHome ? 'accent' : 'secondary'"
        :text-color="isHome ? 'dark' : undefined"
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHotelStore } from 'src/entities/hotel'
import { LocaleSwitcher } from 'src/features/switch-locale'
import { NAV_LINKS } from './nav-links'

const { t } = useI18n()
const route = useRoute()
const isHome = computed(() => route.name === 'home')
const isScrolled = ref(false)
const { profile } = storeToRefs(useHotelStore())
const digits = (phone: string) => phone.replace(/[^\d+]/g, '')

const updateScrollState = () => {
  isScrolled.value = window.scrollY > 48
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
})
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

  &__mark > span {
    display: block;
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

  &--immersive {
    position: absolute;
    inset: 0 0 auto;
    border-bottom: 0;
    background: transparent;
    color: var(--c-white);

    .site-header__strip {
      max-height: 2.5rem;
      overflow: hidden;
      border-bottom: 1px solid rgb(255 255 255 / 12%);
      background: rgb(16 25 31 / 34%);
      backdrop-filter: blur(8px);
      opacity: 1;
      transition:
        max-height 180ms ease,
        opacity 180ms ease,
        border-color 180ms ease;
    }

    .site-header__bar {
      position: relative;
      isolation: isolate;
      border-bottom: 0;
      background: transparent;

      &::before {
        position: absolute;
        z-index: -1;
        inset-block: 0;
        left: 50%;
        width: 100vw;
        transform: translateX(-50%);
        border-bottom: 1px solid rgb(255 255 255 / 18%);
        background: rgb(16 25 31 / 18%);
        backdrop-filter: blur(8px);
        content: '';
      }
    }

    .site-header__brand,
    .site-header__nav a {
      color: var(--c-white);
    }

    .site-header__mark {
      transform: rotate(45deg);
      border: 1px solid var(--c-signal);
      border-radius: 0;
      background: transparent;
      color: var(--c-signal);
      font-size: 1rem;

      > span {
        transform: rotate(-45deg);
      }
    }

    .site-header__nav a:hover {
      color: var(--c-signal);
      text-decoration: none;
    }

    .site-header__cta {
      background: var(--c-signal);
      color: var(--c-tarmac);
    }

    .site-header__menu {
      color: var(--c-white);
    }

    :deep(.locale-switcher) {
      color: var(--c-white);
    }
  }

  &--immersive.site-header--scrolled {
    position: fixed;
    z-index: 2000;
    border-bottom: 1px solid rgb(255 255 255 / 14%);
    background: rgb(16 25 31 / 92%);
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 14%);
    backdrop-filter: blur(14px);

    .site-header__strip {
      max-height: 0;
      border: 0;
      opacity: 0;
      pointer-events: none;
    }

    .site-header__bar {
      min-height: 3.75rem;
      transition: min-height 180ms ease;

      &::before {
        border: 0;
        background: transparent;
        backdrop-filter: none;
      }
    }
  }
}
</style>
