import { Header } from '#components';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Header component', () => {

  let header;
  beforeAll(async () => {
    header = await mountSuspended(Header)
    await header.vm.$nextTick()
  })

  it('has a main navigation', async () => {
    const mainNav = await header.find('nav.header-main-nav')
    expect(mainNav.exists()).toBe(true)
  })

  it('contains correct main navigation links', async () => {
    const mainNav = await header.find('nav.header-main-nav')
    expect(mainNav.find('a[href="/"]').text()).toContain('Home')
    expect(mainNav.find('a[href="/public"]').text()).toContain('Public')
    expect(mainNav.find('a[href="/private"]').text()).toContain('Private')
  })

  it('has a login navigation', async () => {
    const loginNav = await header.find('.header-login-nav')
    expect(loginNav.exists()).toBe(true)
  })

  it('contains correct login navigation links', async () => {
    const loginNav = await header.find('.header-login-nav')
    expect(loginNav.find('a[href="/login"]').text()).toContain('Log in')
    expect(loginNav.find('a[href="/signup"]').text()).toContain('Sign up')
  })

})