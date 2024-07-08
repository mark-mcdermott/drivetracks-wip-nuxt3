import { expect, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import homePage from './../../pages/index.vue'

describe('Home page', () => {
  it('is a Vue instance', () => {
    expect(mount(homePage).vm).toBeTruthy()
  })
})

describe('Home page, when logged out', () => {
  it('shows login form', () => {
    const wrapper = mount(homePage)
    expect(wrapper.find("form").exists()).toBe(true)
    expect(wrapper.find("input").exists()).toBe(true)
  })
})

describe('Home page, when logged in', () => {
  it('does not show login form', () => {
    vi.stubGlobal("useAuth", () => { return { status: 'authenticated' }}) // logged in
    const wrapper = mount(homePage)
    expect(wrapper.find("form").exists()).toBe(false)
    expect(wrapper.find("input").exists()).toBe(false)
  })
})

describe('Home page has correct copy', () => {
  it('has correct h2 text', () => {
    expect(mount(homePage).find("h2").text()).toBe('Home');
  })
  it('has correct p text', () => {
    expect(mount(homePage).find("p").text()).toContain('Most bee jobs are small ones. But bees know that every small job, if it\'s done well means a lot. But choose carefully because you\'ll stay in the job you pick for the rest of your life.');
  })
})