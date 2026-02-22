import { OrderItem } from '../../features/order-management/order-management.types';
import { TranslateService } from '@ngx-translate/core';

export class OrderUtil {
  static calculateOrderTotal(orderItems: OrderItem[]): number {
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  static getCustomizationDisplay(customization: OrderItem['customization'], translateService?: TranslateService): string[] {
    if (!customization) return [];

    const display: string[] = [];

    Object.entries(customization).forEach(([key, value]) => {
      if (key === 'note' && value) {
        const noteLabel = translateService ? translateService.instant('common.note') : 'Note';
        display.push(`${noteLabel}: ${value}`);
      } else if (value && key !== 'note') {
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        display.push(`${key}: ${displayValue}`);
      }
    });

    return display;
  }
}
