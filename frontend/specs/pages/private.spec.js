import { expect, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import privatePage from './../../pages/private.vue'

vi.stubGlobal("definePageMeta", () => {})
vi.stubGlobal("ref", (initialValue) => { return { value: initialValue } })

describe('Private page has correct copy', () => {
  it('has correct h2 text', () => {
    expect(mount(privatePage).find("h2").text()).toBe('Private');
  })
  it('has correct p text', () => {
    expect(mount(privatePage).find("p").text()).toContain("We know that you, as a bee, have worked your whole life to get to the point where you can work for your whole life. Honey begins when our valiant Pollen Jocks bring the nectar to the hive. Our top-secret formula is automatically color-corrected, scent-adjusted and bubble-contoured into this soothing sweet syrup with its distinctive golden glow you know as Honey!");
  })
})