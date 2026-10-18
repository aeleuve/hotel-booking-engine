<template>
  <q-form class="guest-form" greedy @submit="emit('submit', { ...guest })">
    <div class="guest-form__row">
      <q-input
        v-model.trim="guest.firstName"
        outlined
        :label="t('checkout.firstName')"
        autocomplete="given-name"
        :rules="[required]"
      />
      <q-input
        v-model.trim="guest.lastName"
        outlined
        :label="t('checkout.lastName')"
        autocomplete="family-name"
        :rules="[required]"
      />
    </div>
    <q-input
      v-model.trim="guest.email"
      outlined
      type="email"
      :label="t('checkout.email')"
      autocomplete="email"
      :rules="[required, validEmail]"
    />
    <q-input
      v-model.trim="guest.phone"
      outlined
      type="tel"
      :label="t('checkout.phone')"
      autocomplete="tel"
      :rules="[required, validPhone]"
    />
    <q-btn
      type="submit"
      unelevated
      no-caps
      size="lg"
      color="secondary"
      :loading="loading"
      :label="t('checkout.toPayment')"
      class="guest-form__submit"
    />
  </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GuestDetails } from 'src/entities/booking'

const props = defineProps<{ initial: GuestDetails; loading?: boolean }>()
const emit = defineEmits<{ submit: [guest: GuestDetails] }>()
const { t } = useI18n()
const guest = reactive({ ...props.initial })

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s()-]{6,20}$/

const required = (value: string) => !!value || t('checkout.errors.required')
const validEmail = (value: string) => EMAIL.test(value) || t('checkout.errors.email')
const validPhone = (value: string) => PHONE.test(value) || t('checkout.errors.phone')
</script>

<style scoped lang="scss">
.guest-form {
  display: grid;
  gap: 0.25rem;

  &__row {
    display: grid;
    gap: 0.25rem 1rem;

    @media (min-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__submit {
    justify-self: start;
    font-weight: 700;
  }
}
</style>
