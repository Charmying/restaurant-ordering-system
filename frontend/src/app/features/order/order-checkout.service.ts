import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { CartService } from './cart.service';
import { MenuItemResolver } from './menu-item.resolver';
import { CartItem } from './cart.types';
import { CreateOrderDto, CreatedOrderResponse } from './order-api.types';

@Injectable({
  providedIn: 'root',
})
export class OrderCheckoutService {
  private readonly api = inject(ApiService);
  private readonly cartService = inject(CartService);
  private readonly menuItemResolver = inject(MenuItemResolver);

  getSingleItemPrice(item: CartItem): number {
    const menuItem = this.menuItemResolver.getById(item.menuItemId);
    if (!menuItem) return item.price;

    let extra = 0;
    item.customizations.forEach((custom) => {
      const field = menuItem.customFields?.find((f) => f.name === custom.fieldName);
      if (!field) return;

      custom.selectedOptions.forEach((optionLabel) => {
        const option = field.options.find((o) => o.label === optionLabel);
        if (option?.price) extra += option.price;
      });
    });

    return item.price + extra;
  }

  buildOrderPayload(tableNumber: number, token: string): CreateOrderDto | null {
    const cart = this.cartService.getCart();
    if (!cart.items.length) return null;

    const items = cart.items.map((item) => {
      const customization: Record<string, unknown> = {};

      if (item.note?.trim()) {
        customization['note'] = item.note.trim();
      }

      item.customizations.forEach((c) => {
        const key = c.fieldId || c.fieldName;
        const values = c.optionIds || c.selectedOptions;
        customization[key] = values.length === 1 ? values[0] : [...values];
      });

      return {
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customization: Object.keys(customization).length ? customization : undefined,
        subtotal: item.subtotal,
      };
    });

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    return {
      tableNumber,
      items,
      total,
      token,
    };
  }

  async submitOrder(tableNumber: number, token: string): Promise<CreatedOrderResponse> {
    const payload = this.buildOrderPayload(tableNumber, token);
    if (!payload) throw new Error('Cart is empty');

    const order = await firstValueFrom(this.api.post<CreatedOrderResponse>('/orders', payload));
    this.cartService.clearCart();
    return order;
  }
}
