<template>
  <div class="counter-field">
    <span :id="labelId" class="counter-field__label">{{ label }}</span>
    <div class="counter-field__controls" role="group" :aria-labelledby="labelId">
      <q-btn
        round
        flat
        dense
        icon="remove"
        :aria-label="`${label} −1`"
        :disable="model <= min"
        @click="model -= 1"
      />
      <output class="counter-field__value" :aria-labelledby="labelId">{{ model }}</output>
      <q-btn
        round
        flat
        dense
        icon="add"
        :aria-label="`${label} +1`"
        :disable="model >= max"
        @click="model += 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

/** Integer stepper with a visible label. */
const { label, min = 0, max = 9 } = defineProps<{ label: string; min?: number; max?: number }>()
const model = defineModel<number>({ required: true })
const labelId = useId()
</script>

<style scoped lang="scss">
.counter-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-block: 0.5rem;

  &__label {
    font-weight: 600;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__value {
    min-width: 1.5rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }
}
</style>
