import { mount } from '@vue/test-utils'
import { QBtn, Quasar } from 'quasar'
import { describe, expect, it } from 'vitest'
import CounterField from './CounterField.vue'

const mountCounter = (modelValue: number) =>
  mount(CounterField, {
    props: { label: 'Adults', min: 1, max: 3, modelValue },
    global: { plugins: [[Quasar, { components: { QBtn } }]] },
  })

describe('CounterField', () => {
  it('increments the model', async () => {
    const wrapper = mountCounter(2)
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('disables decrement at the minimum', () => {
    const wrapper = mountCounter(1)
    expect(wrapper.findAll('button')[0]!.attributes('disabled')).toBeDefined()
  })
})
