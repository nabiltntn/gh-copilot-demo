import { ref, computed, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { Album } from '../types/album'

export interface CartItem {
  album: Album
  qty: number
}

const STORAGE_KEY = 'album-cart'

// Shared state across all instances
const cartItems: Ref<CartItem[]> = ref<CartItem[]>([])
const isInitialized = ref(false)

function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      cartItems.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    cartItems.value = []
  }
}

function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

export function useCart() {
  // Initialize from localStorage only once
  if (!isInitialized.value) {
    loadFromStorage()
    isInitialized.value = true
    
    // Watch for changes and persist to localStorage
    watch(cartItems, () => {
      saveToStorage()
    }, { deep: true })
  }

  const count: ComputedRef<number> = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.qty, 0)
  })

  const total: ComputedRef<number> = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.album.price * item.qty), 0)
  })

  function add(album: Album): void {
    const existingItem = cartItems.value.find(item => item.album.id === album.id)
    
    if (existingItem) {
      existingItem.qty++
    } else {
      cartItems.value.push({ album, qty: 1 })
    }
  }

  function remove(albumId: number): void {
    const existingItem = cartItems.value.find(item => item.album.id === albumId)
    
    if (existingItem) {
      existingItem.qty--
      if (existingItem.qty === 0) {
        cartItems.value = cartItems.value.filter(item => item.album.id !== albumId)
      }
    }
  }

  function clear(): void {
    cartItems.value = []
  }

  return {
    cartItems,
    count,
    total,
    add,
    remove,
    clear
  }
}
