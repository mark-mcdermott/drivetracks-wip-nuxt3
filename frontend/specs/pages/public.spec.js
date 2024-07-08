import { expect, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import publicPage from './../../pages/public.vue'

describe('Public page has correct copy', () => {
  it('has correct h2 text', () => {
    expect(mount(publicPage).find("h2").text()).toBe('Public');
  })
  it('has correct p text', () => {
    expect(mount(publicPage).find("p").text()).toContain("How come you don't fly everywhere? It's exhausting. Why don't you run everywhere? It's faster. Yeah, OK, I see, I see. All right, your turn. TiVo. You can just freeze live TV? That's insane! You don't have that? We have Hivo, but it's a disease. It's a horrible, horrible disease.");
  })
})