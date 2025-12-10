import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AlbumCard from '../src/components/AlbumCard.vue'
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

describe('AlbumCard', () => {
  const mockAlbum: Album = {
    id: 1,
    title: 'Test Album',
    artist: 'Test Artist',
    price: 9.99,
    image_url: 'https://example.com/image.jpg'
  }

  beforeEach(() => {
    localStorageMock.clear()
    const { clear } = useCart()
    clear()
  })

  it('should render album information', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      }
    })

    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('$9.99')
  })

  it('should display album image', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      }
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Test Album')
  })

  it('should have Add to Cart button', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      }
    })

    const addButton = wrapper.find('.btn-primary')
    expect(addButton.exists()).toBe(true)
    expect(addButton.text()).toBe('Add to Cart')
  })

  it('should add album to cart when Add to Cart is clicked', async () => {
    const { cartItems, count } = useCart()

    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      }
    })

    const addButton = wrapper.find('.btn-primary')
    await addButton.trigger('click')

    expect(count.value).toBe(1)
    expect(cartItems.value.length).toBe(1)
    expect(cartItems.value[0].album.id).toBe(1)
    expect(cartItems.value[0].qty).toBe(1)
  })

  it('should increment quantity when Add to Cart is clicked multiple times', async () => {
    const { cartItems, count } = useCart()

    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      }
    })

    const addButton = wrapper.find('.btn-primary')
    await addButton.trigger('click')
    await addButton.trigger('click')
    await addButton.trigger('click')

    expect(count.value).toBe(3)
    expect(cartItems.value.length).toBe(1)
    expect(cartItems.value[0].qty).toBe(3)
  })

  it('should handle image load error', async () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      }
    })

    const img = wrapper.find('img')
    await img.trigger('error')

    expect(img.attributes('src')).toContain('placeholder')
  })
})
