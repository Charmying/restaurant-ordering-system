import { Table } from './table-management.types';
import { OrderItem } from '../../features/order-management/order-management.types';
import { CurrencyUtil } from '../../shared/utils/currency.util';
import { OrderUtil } from '../../shared/utils/order.util';
import { TranslateService } from '@ngx-translate/core';
import { OrderItemResolverService } from '../../shared/services/order-item-resolver.service';

export class TableManagementPresenter {
  static formatCurrency(amount: number): string {
    return CurrencyUtil.formatCurrency(amount);
  }

  static getCustomizationDisplay(customization: OrderItem['customization'], translateService?: TranslateService): string[] {
    return OrderUtil.getCustomizationDisplay(customization, translateService);
  }

  static calculateOrderTotal(orderItems: OrderItem[], orderItemResolver?: OrderItemResolverService): number {
    if (orderItemResolver) {
      return orderItems.reduce((total, item) => {
        return total + orderItemResolver.getItemTotal(item);
      }, 0);
    }
    // Fallback to original calculation if resolver not provided
    return OrderUtil.calculateOrderTotal(orderItems);
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
