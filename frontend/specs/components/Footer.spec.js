import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from './../../components/Footer.vue'

const wrapper = mount(Footer)

describe('Footer', () => {
  it('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })
  it('has correct html', () => {
    expect(wrapper.html()).toContain('<footer><small>Built with <a href="https://picocss.com">Pico</a></small></footer>')
  })
})