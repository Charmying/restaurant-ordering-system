import { TranslateService } from '@ngx-translate/core';
import { CurrencyUtil } from '../../shared/utils/currency.util';
import { OrderUtil } from '../../shared/utils/order.util';
import { OrderItem } from './order-management.types';

export class OrderManagementPresenter {
  static formatCurrency(amount: number): string {
    return CurrencyUtil.formatCurrency(amount);
  }

  static mergeOrderItems(items: OrderItem[]): OrderItem[] {
    const itemsMap = new Map<string, OrderItem>();
    items.forEach(item => {
      const key = `${item.name}-${item.price}-${JSON.stringify(item.customization || {})}`;
      if (itemsMap.has(key)) {
        const existing = itemsMap.get(key);
        if (existing) {
          existing.quantity += item.quantity;
        }
      } else {
        itemsMap.set(key, { ...item });
      }
    });
    return Array.from(itemsMap.values());
  }

  static getCustomizationDisplay(customization: OrderItem['customization'], translateService?: TranslateService): string[] {
    return OrderUtil.getCustomizationDisplay(customization, translateService);
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
