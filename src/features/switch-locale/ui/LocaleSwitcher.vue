<template>
  <q-btn-dropdown
    flat
    dense
    no-caps
    icon="language"
    :label="locale.toUpperCase()"
    :aria-label="`${t('locale.label')}: ${LOCALE_NAMES[current]}`"
    class="locale-switcher"
  >
    <q-list>
      <q-item
        v-for="option in SUPPORTED_LOCALES"
        :key="option"
        v-close-popup
        clickable
        :active="option === current"
        :lang="option"
        @click="select(option)"
      >
        <q-item-section>{{ LOCALE_NAMES[option] }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAppLocale, LOCALE_NAMES, SUPPORTED_LOCALES, type AppLocale } from 'src/shared/i18n'
import { storeLocale } from '../model/locale'

const { t, locale } = useI18n()
const current = computed<AppLocale>(() => (isAppLocale(locale.value) ? locale.value : 'en'))

const select = (option: AppLocale) => {
  locale.value = option
  storeLocale(option)
}
</script>
