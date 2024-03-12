import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AcessoView from '@/views/AcessoView.vue'

describe('AcessoView', () => {
  it('renders correctly', () => {
    const wrapper = mount(AcessoView)
    expect(wrapper.text()).toContain('Carregando...')
  })
})
