<template>
  <div class="cancel-booking">
    <q-btn
      v-if="!confirming"
      outline
      no-caps
      color="negative"
      :label="t('myBooking.cancel')"
      :disable="!cancellable"
      @click="confirming = true"
    />
    <div
      v-else
      class="cancel-booking__confirm"
      role="alertdialog"
      aria-labelledby="cancel-question"
    >
      <p id="cancel-question">
        {{ cancellable ? t('myBooking.confirmFree') : t('myBooking.confirmCharged') }}
      </p>
      <div class="cancel-booking__actions">
        <q-btn
          unelevated
          no-caps
          color="negative"
          :loading="loading"
          :label="t('myBooking.confirmCancel')"
          @click="emit('cancel')"
        />
        <q-btn flat no-caps :label="t('myBooking.keep')" @click="confirming = false" />
      </div>
    </div>
    <p v-if="!cancellable" class="cancel-booking__note">{{ t('myBooking.notRefundable') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{ cancellable: boolean; loading?: boolean }>()
const emit = defineEmits<{ cancel: [] }>()
const { t } = useI18n()
const confirming = ref(false)
</script>

<style scoped lang="scss">
.cancel-booking {
  display: grid;
  gap: 0.75rem;
  justify-items: start;

  &__confirm {
    display: grid;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-left: 4px solid var(--q-negative);
    background: var(--c-concrete);
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
  }

  &__note {
    font-size: var(--fs-small);
    color: var(--c-tarmac-soft);
  }
}
</style>
