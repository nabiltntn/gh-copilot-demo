import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CartPanel from '../src/components/CartPanel.vue'
import { useCart } from '../src/composables/useCart'
import type { Album } from '../src/types/album'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('CartPanel', () => {
  const mockAlbum1: Album = {
    id: 1,
    title: 'Test Album 1',
    artist: 'Test Artist 1',
    price: 9.99,
    image_url: 'https://example.com/image1.jpg'
  }

  const mockAlbum2: Album = {
    id: 2,
    title: 'Test Album 2',
    artist: 'Test Artist 2',
    price: 12.99,
    image_url: 'https://example.com/image2.jpg'
  }

  beforeEach(() => {
    localStorageMock.clear()
    const { clear } = useCart()
    clear()
  })

  it('should render empty cart message when cart is empty', () => {
    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    expect(wrapper.text()).toContain('Your cart is empty')
  })

  it('should display cart items when cart has items', () => {
    const { add } = useCart()
    add(mockAlbum1)

    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    expect(wrapper.text()).toContain('Test Album 1')
    expect(wrapper.text()).toContain('Test Artist 1')
    expect(wrapper.text()).toContain('$9.99')
  })

  it('should display multiple cart items', () => {
    const { add } = useCart()
    add(mockAlbum1)
    add(mockAlbum2)

    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    expect(wrapper.text()).toContain('Test Album 1')
    expect(wrapper.text()).toContain('Test Album 2')
  })

  it('should display correct quantity for items', () => {
    const { add } = useCart()
    add(mockAlbum1)
    add(mockAlbum1)
    add(mockAlbum1)

    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    expect(wrapper.text()).toContain('Qty: 3')
  })

  it('should calculate and display total correctly', () => {
    const { add } = useCart()
    add(mockAlbum1) // 9.99
    add(mockAlbum1) // 9.99
    add(mockAlbum2) // 12.99

    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    expect(wrapper.text()).toContain('$32.97')
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    const closeBtn = wrapper.find('.close-btn')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should emit close event when overlay is clicked', async () => {
    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    const overlay = wrapper.find('.cart-panel-overlay')
    await overlay.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should remove item when remove button is clicked', async () => {
    const { add, cartItems } = useCart()
    add(mockAlbum1)
    add(mockAlbum1)

    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    const removeBtn = wrapper.find('.remove-btn')
    await removeBtn.trigger('click')

    expect(cartItems.value[0].qty).toBe(1)
  })

  it('should not display footer when cart is empty', () => {
    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    expect(wrapper.find('.cart-footer').exists()).toBe(false)
  })

  it('should display footer when cart has items', () => {
    const { add } = useCart()
    add(mockAlbum1)

    const wrapper = mount(CartPanel, {
      props: {
        isOpen: true
      }
    })

    expect(wrapper.find('.cart-footer').exists()).toBe(true)
  })
})
