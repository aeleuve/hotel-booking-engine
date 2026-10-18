<template>
  <q-form class="lookup-form" greedy @submit="emit('submit', bookingId, email)">
    <q-input
      v-model.trim="bookingId"
      outlined
      :label="t('myBooking.bookingId')"
      :rules="[required]"
    />
    <q-input
      v-model.trim="email"
      outlined
      type="email"
      :label="t('myBooking.email')"
      autocomplete="email"
      :rules="[required]"
    />
    <q-btn
      type="submit"
      unelevated
      no-caps
      color="secondary"
      size="lg"
      :loading="loading"
      :label="t('myBooking.find')"
      class="lookup-form__submit"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ initialId?: string; initialEmail?: string; loading?: boolean }>()
const emit = defineEmits<{ submit: [bookingId: string, email: string] }>()
const { t } = useI18n()
const bookingId = ref(props.initialId ?? '')
const email = ref(props.initialEmail ?? '')
const required = (value: string) => !!value || t('checkout.errors.required')
</script>

<style scoped lang="scss">
.lookup-form {
  display: grid;
  gap: 0.25rem;
  max-width: 28rem;

  &__submit {
    justify-self: start;
    font-weight: 700;
  }
}
</style>
