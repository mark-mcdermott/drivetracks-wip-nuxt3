import { Header } from '#components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('Header component', () => {
  let header

  beforeAll(async () => {
    header = await mountSuspended(Header)
    await flushPromises()
  })

  it('has a main navigation', async () => {
    const mainNav = await header.find('nav.header-main-nav')
    expect(mainNav.exists()).toBe(true)
  })

  it('contains correct main navigation links', async () => {
    const mainNav = await header.find('nav.header-main-nav')
    expect(mainNav.exists()).toBe(true)

    const homeLink = mainNav.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toContain('Home')

    const publicLink = mainNav.find('a[href="/public"]')
    expect(publicLink.exists()).toBe(true)
    expect(publicLink.text()).toContain('Public')
  })

  it('has a login navigation', async () => {
    const loginNav = await header.find('.header-login-nav')
    expect(loginNav.exists()).toBe(true)
  })

  it('contains correct login navigation links', async () => {
    const loginNav = await header.find('.header-login-nav')
    expect(loginNav.exists()).toBe(true)

    const loginLink = loginNav.find('a[href="/login"]')
    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toContain('Log in')

    const signupLink = loginNav.find('a[href="/signup"]')
    expect(signupLink.exists()).toBe(true)
    expect(signupLink.text()).toContain('Sign up')
  })
})