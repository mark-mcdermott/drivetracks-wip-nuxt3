import { Header } from '#components'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { afterEach, expect, it, test, beforeEach, vi } from 'vitest';

// was unable to move header/mainNav declarations to beforeEach because of conflict with vi.hoisted - never did find a solution 
const { useAuthMock } = vi.hoisted(() => {
  return { useAuthMock: vi.fn().mockImplementation(() => { return { status: "unauthenticated" } }) }
})
mockNuxtImport('useAuth', () => { return useAuthMock })

it('has a main navigation', async () => {
  const header = await mountSuspended(Header)
  const mainNav = await header.find('nav.header-main-nav')
  expect(mainNav.exists()).toBe(true)
})

it('contains correct main navigation links', async () => {
  const header = await mountSuspended(Header);
  const mainNav = await header.find('nav.header-main-nav')
  expect(mainNav.find('a[href="/"]').text()).toContain('Home')
  expect(mainNav.find('a[href="/public"]').text()).toContain('Public')
  expect(mainNav.find('a[href="/private"]').exists()).toBe(false)
})

it('has a login navigation', async () => {
  const header = await mountSuspended(Header);
  const loginNav = await header.find('.header-login-nav')
  expect(loginNav.exists()).toBe(true)
})

test('when authenticated contains correct main navigation links', async () => {
  useAuthMock.mockImplementation(() => {
    return { status: "authenticated" }
  })
  
  const header = await mountSuspended(Header);
  const mainNav = await header.find('nav.header-main-nav');
  expect(mainNav.find('a[href="/"]').text()).toContain('Home')
  expect(mainNav.find('a[href="/public"]').text()).toContain('Public')
  expect(mainNav.find('a[href="/private"]').text()).toContain('Private')
})

it('has a login navigation', async () => {
  useAuthMock.mockImplementation(() => {
    return { status: "authenticated" }
  })
  const header = await mountSuspended(Header)
  const loginNav = await header.find('.header-login-nav')
  expect(loginNav.exists()).toBe(true)
})