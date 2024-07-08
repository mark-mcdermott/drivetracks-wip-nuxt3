import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from './../../components/Header.vue'

describe('Header', () => {
  const wrapper = mount(Header)
  const h1 = wrapper.find("h1")

  it('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('has correct title', () => {
    expect(h1.text()).toBe('Auth Test App');
  })

  it('has correct h1 html', () => {
    const h1Element = h1.element.cloneNode(true);
    removeDataAttributes(h1Element);
    const h1Html = h1Element.outerHTML;
    expect(h1Html).toMatch('<h1><icon name="fa-solid:lock" mode="svg" size="0.8em"></icon> Auth Test App </h1>')
  })
})


// Helper to remove data attributes recursively
function removeDataAttributes(node) {
  if (node.nodeType === 1) { // Element node
    const attributes = Array.from(node.attributes);
    for (const attr of attributes) {
      if (attr.name.startsWith('data-')) {
        node.removeAttribute(attr.name);
      }
    }
    for (const child of node.childNodes) {
      removeDataAttributes(child);
    }
  }
}