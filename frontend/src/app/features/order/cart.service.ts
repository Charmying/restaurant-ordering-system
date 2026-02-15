import { Injectable, signal, computed, effect } from '@angular/core';
import { Cart, CartItem, CartItemCustomization } from './cart.types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'restaurant_cart';
  private cartItems = signal<CartItem[]>([]);

  readonly cart = computed(() => {
    const items = this.cartItems();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, totalItems, totalPrice };
  });

  readonly isEmpty = computed(() => this.cart().totalItems === 0);
  readonly cartItemCount = computed(() => this.cart().totalItems);

  constructor() {
    effect(() => {
      const data = JSON.stringify(this.cartItems());
      localStorage.setItem(this.STORAGE_KEY, data);
    });

    this.#loadFromStorage();
  }

  addItem(
    menuItemId: string,
    name: string,
    price: number,
    customizations: CartItemCustomization[],
    note: string,
    image?: string,
    quantity: number = 1,
    unitPrice: number = price
  ): CartItem {
    const key = this.#generateItemKey(menuItemId, customizations, note);
    const existingIndex = this.cartItems().findIndex(
      (item) => this.#generateItemKey(item.menuItemId, item.customizations, item.note) === key
    );

    if (existingIndex !== -1) {
      const updated = [...this.cartItems()];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].subtotal = unitPrice * updated[existingIndex].quantity;
      this.cartItems.set(updated);
      return updated[existingIndex];
    }

    const cartItem: CartItem = {
      id: this.#generateUUID(),
      menuItemId,
      name,
      price,
      image,
      quantity,
      customizations,
      note,
      subtotal: unitPrice * quantity,
    };

    this.cartItems.set([...this.cartItems(), cartItem]);
    return cartItem;
  }

  removeItem(itemId: string): void {
    this.cartItems.set(this.cartItems().filter((item) => item.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const updated = [...this.cartItems()];
    const index = updated.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      updated[index].quantity = quantity;
      updated[index].subtotal = updated[index].price * quantity;
      this.cartItems.set(updated);
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getCart(): Cart {
    return this.cart();
  }

  getItem(itemId: string): CartItem | undefined {
    return this.cartItems().find((item) => item.id === itemId);
  }

  clear(): void {
    this.clearCart();
  }

  #generateItemKey(menuItemId: string, customizations: CartItemCustomization[], note: string): string {
    const customStr = JSON.stringify(customizations);
    return `${menuItemId}:${customStr}:${note}`;
  }

  #generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  #loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const items = JSON.parse(data) as CartItem[];
        this.cartItems.set(items.map((item) => ({ ...item, subtotal: item.subtotal ?? item.price * item.quantity })));
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      this.cartItems.set([]);
    }
  }
}
