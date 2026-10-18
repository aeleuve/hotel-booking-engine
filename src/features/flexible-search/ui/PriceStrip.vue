<template>
  <section
    v-if="status !== 'idle'"
    class="page-section price-strip"
    aria-labelledby="flexible-title"
  >
    <div class="container">
      <SectionHeader title-id="flexible-title" :title="t('flexible.title')" />
      <div v-if="status === 'searching'" class="price-strip__progress">
        <p role="status">{{ t('flexible.progress', { done, total: entries.length }) }}</p>
        <span class="price-strip__meter" :style="{ '--done': progress }" aria-hidden="true" />
      </div>
      <p v-if="message" class="price-strip__message" role="alert">
        <i18n-t v-if="phone" :keypath="message" scope="global">
          <template #phone>
            <a :href="`tel:${phone.replace(/\s/g, '')}`">{{ phone }}</a>
          </template>
        </i18n-t>
        <template v-else>{{
          t(message === 'flexible.noDates' ? message : `${message}NoPhone`)
        }}</template>
      </p>
      <ol v-if="showBoard" class="price-strip__board">
        <li v-for="entry in entries" :key="entry.range.checkIn">
          <button
            type="button"
            class="price-strip__flap"
            :class="{
              'price-strip__flap--best': entry === best,
              'price-strip__flap--closed': isClosed(entry),
            }"
            :disabled="isDisabled(entry)"
            :aria-current="isCurrent(entry) ? 'true' : undefined"
            @click="choose(entry)"
          >
            <span class="visually-hidden">{{
              t('flexible.choose', { range: rangeLabel(entry) })
            }}</span>
            <span class="price-strip__days" aria-hidden="true">
              <span>{{ dayLabel(entry.range.checkIn) }}</span>
              <span class="price-strip__out">{{ dayLabel(entry.range.checkOut) }}</span>
            </span>
            <span v-if="entry.price" class="price-strip__price">{{
              formatMoney(entry.price)
            }}</span>
            <span v-else-if="isClosed(entry)" class="price-strip__note">{{
              t(`flexible.${entry.state}`)
            }}</span>
            <span v-else class="price-strip__pending" aria-hidden="true" />
            <span v-if="entry === best" class="price-strip__tag">{{ t('flexible.best') }}</span>
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatMoney, useHotelStore, type IsoDate } from 'src/entities/hotel'
import { useAvailabilityStore } from 'src/features/check-availability'
import { formatDay, formatWeekday, localToday } from 'src/shared/lib/date'
import { SectionHeader } from 'src/shared/ui'
import { useFlexibleSearchStore, type FlexibleEntry } from '../model/flexible-search-store'

const { t, locale } = useI18n()
const formatMoney = useFormatMoney()
const availability = useAvailabilityStore()
const flexible = useFlexibleSearchStore()
const { entries, status, done, best } = storeToRefs(flexible)
const { profile } = storeToRefs(useHotelStore())
const phone = computed(() => profile.value?.phone?.trim() ?? '')

const hasPrices = computed(() => entries.value.some((entry) => entry.state === 'priced'))
const showBoard = computed(
  () => status.value === 'searching' || (status.value === 'done' && hasPrices.value),
)
const progress = computed(() => (entries.value.length ? done.value / entries.value.length : 0))

const message = computed(() => {
  if (status.value === 'too-many-guests') return 'flexible.tooManyGuests'
  if (status.value === 'error') return 'flexible.error'
  if (status.value === 'done' && !entries.value.length) return 'flexible.noDates'
  if (status.value === 'done' && !hasPrices.value) return 'flexible.noResults'
  return null
})

const isClosed = ({ state }: FlexibleEntry) => state === 'unavailable' || state === 'failed'
const isDisabled = ({ price, state }: FlexibleEntry) =>
  !price || isClosed({ state } as FlexibleEntry)

const isCurrent = ({ range }: FlexibleEntry) =>
  availability.query.checkIn === range.checkIn && availability.query.checkOut === range.checkOut

const dayLabel = (date: IsoDate) =>
  `${formatWeekday(date, locale.value)} ${formatDay(date, locale.value)}`

const rangeLabel = ({ range }: FlexibleEntry) =>
  `${dayLabel(range.checkIn)} – ${dayLabel(range.checkOut)}`

const choose = ({ range }: FlexibleEntry) => {
  flexible.noteChoice()
  availability.query = { ...availability.query, ...range }
  void availability.search(localToday())
}
</script>

<style scoped lang="scss">
// A departures board: dark flaps, white type, the cheapest flap in signal yellow.
.price-strip {
  --board: var(--c-tarmac);
  --flap: #31373d;
  --flap-ink: var(--c-white);
  --flap-soft: #aab2ba;

  padding-top: clamp(2.5rem, 6vw, 4rem);
  padding-bottom: 0;

  &__progress {
    display: grid;
    gap: 0.5rem;
    max-width: 24rem;
    margin-bottom: 1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__meter {
    display: block;
    height: 4px;
    background:
      linear-gradient(
        to right,
        var(--c-runway) calc(var(--done) * 100%),
        transparent calc(var(--done) * 100%)
      ),
      var(--c-concrete-deep);
    transition: background 0.2s;
  }

  &__message {
    max-width: 40rem;
    padding: 1rem 1.25rem;
    border-left: 6px solid var(--c-signal);
    border-radius: var(--radius-sign);
    background: var(--c-white);
    font-weight: 600;
  }

  &__board {
    display: flex;
    gap: 0.5rem;
    margin: 0;
    padding: 0.75rem;
    list-style: none;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    scroll-padding-inline: 0.75rem;
    background: var(--board);
    border-radius: var(--radius-sign);
    box-shadow: 0 1.5rem 3rem -1.5rem rgb(36 41 46 / 0.55);

    > li {
      flex: none;
      scroll-snap-align: start;
    }
  }

  &__flap {
    position: relative;
    display: grid;
    align-content: start;
    gap: 0.75rem;
    min-width: 8.75rem;
    max-width: 11rem;
    min-height: 100%;
    padding: 0.875rem 1rem 1rem;
    border: 0;
    border-radius: var(--radius-sign);
    background: var(--flap);
    color: var(--flap-ink);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover:not(:disabled) {
      background: #3d444b;
    }

    &:focus-visible {
      outline: 3px solid var(--c-signal);
      outline-offset: 2px;
    }

    &[aria-current='true'] {
      box-shadow: inset 0 0 0 2px var(--flap-ink);
    }

    &--best {
      --flap-ink: var(--c-tarmac);
      --flap-soft: #4a4200;

      background: var(--c-signal);

      &:hover:not(:disabled) {
        background: #ffc61a;
      }

      &:focus-visible {
        outline-color: var(--c-white);
      }
    }

    &--closed {
      --flap-ink: var(--flap-soft);

      cursor: not-allowed;
    }
  }

  // The split between the two halves of a flap, as on a mechanical board.
  &__days {
    display: grid;
    margin-inline: -1rem;
    padding: 0 1rem 0.75rem;
    border-bottom: 1px solid rgb(0 0 0 / 0.35);
    font-size: var(--fs-small);
    font-weight: 700;
    line-height: 1.3;
    font-variant-numeric: tabular-nums;
  }

  &__out {
    color: var(--flap-soft);

    &::before {
      content: '→ ';
    }
  }

  &__price {
    font-stretch: var(--wide);
    font-weight: 800;
    font-size: var(--fs-h3);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    animation: flap-turn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &__note {
    font-size: var(--fs-small);
    font-weight: 600;
    line-height: 1.3;
  }

  &__pending {
    display: block;
    width: 4.5rem;
    height: 1.5rem;
    border-radius: var(--radius-sign);
    background: rgb(255 255 255 / 0.12);
    animation: flap-wait 1.2s ease-in-out infinite alternate;
  }

  &__tag {
    justify-self: start;
    padding: 0.125rem 0.5rem;
    border-radius: var(--radius-sign);
    background: var(--c-tarmac);
    color: var(--c-signal);
    font-size: var(--fs-small);
    font-weight: 700;
  }
}

@keyframes flap-turn {
  from {
    opacity: 0;
    transform: perspective(20rem) rotateX(-80deg);
    transform-origin: top;
  }
}

@keyframes flap-wait {
  to {
    opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .price-strip__price,
  .price-strip__pending {
    animation: none;
  }
}
</style>
