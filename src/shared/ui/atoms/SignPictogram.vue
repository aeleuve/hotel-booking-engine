<template>
  <span class="sign-pictogram" :class="`sign-pictogram--${tone}`" aria-hidden="true">
    <q-icon :name="icon" />
  </span>
</template>

<script setup lang="ts">
/** Square airport-sign pictogram. Decorative: pair it with visible text. */
withDefaults(defineProps<{ icon: string; tone?: 'tarmac' | 'signal' }>(), { tone: 'tarmac' })
</script>

<style scoped lang="scss">
.sign-pictogram {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-sign);
  font-size: 1.5rem;

  &--tarmac {
    background: var(--c-tarmac);
    color: var(--c-white);
  }

  &--signal {
    background: var(--c-signal);
    color: var(--c-tarmac);
  }
}
</style>
