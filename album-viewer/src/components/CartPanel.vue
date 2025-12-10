<template>
  <div class="cart-panel-overlay" @click="onClose">
    <div class="cart-panel" @click.stop>
      <div class="cart-header">
        <h2>🛒 Shopping Cart</h2>
        <button class="close-btn" @click="onClose" aria-label="Close cart">✕</button>
      </div>
      
      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
          <p class="empty-subtitle">Add some albums to get started!</p>
        </div>
        
        <div v-else class="cart-items">
          <div 
            v-for="item in cartItems" 
            :key="item.album.id" 
            class="cart-item"
          >
            <img 
              :src="item.album.image_url" 
              :alt="item.album.title"
              class="item-image"
              @error="handleImageError"
            />
            <div class="item-details">
              <h3 class="item-title">{{ item.album.title }}</h3>
              <p class="item-artist">{{ item.album.artist }}</p>
              <p class="item-price">${{ item.album.price.toFixed(2) }}</p>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <span class="quantity-label">Qty: {{ item.qty }}</span>
              </div>
              <button 
                class="remove-btn" 
                @click="handleRemove(item.album.id)"
                aria-label="Remove one item"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span class="total-value">${{ total.toFixed(2) }}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">Total:</span>
            <span class="total-value">${{ total.toFixed(2) }}</span>
          </div>
        </div>
        <div class="cart-actions">
          <button class="clear-btn" @click="handleClear">
            Clear Cart
          </button>
          <button class="checkout-btn">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { cartItems, total, remove, clear } = useCart()

const onClose = (): void => {
  emit('close')
}

const handleRemove = (albumId: number): void => {
  remove(albumId)
}

const handleClear = (): void => {
  if (confirm('Are you sure you want to clear your cart?')) {
    clear()
  }
}

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/80x80/667eea/white?text=Album'
}
</script>

<style scoped>
.cart-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cart-panel {
  background: white;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #667eea;
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-cart p {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.empty-subtitle {
  font-size: 1rem !important;
  color: #9ca3af;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  transition: box-shadow 0.2s ease;
}

.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-artist {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.item-price {
  margin: 0;
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
}

.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.remove-btn {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.remove-btn:hover {
  background: #ef4444;
  color: white;
}

.cart-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem;
  background: #f9fafb;
}

.cart-total {
  margin-bottom: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.grand-total {
  border-top: 2px solid #e5e7eb;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.total-label {
  color: #6b7280;
}

.grand-total .total-label,
.grand-total .total-value {
  color: #111827;
}

.total-value {
  color: #667eea;
  font-weight: 600;
}

.cart-actions {
  display: flex;
  gap: 0.75rem;
}

.clear-btn,
.checkout-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn {
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.clear-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.checkout-btn {
  background: #667eea;
  color: white;
}

.checkout-btn:hover {
  background: #5a6fd8;
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }
  
  .cart-header {
    padding: 1rem;
  }
  
  .cart-item {
    flex-direction: column;
  }
  
  .item-actions {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
