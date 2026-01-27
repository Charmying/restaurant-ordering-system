import { Table, OrderItem } from './table-management.types';
import { CurrencyUtil } from '../../shared/utils/currency.util';
import { OrderUtil } from '../../shared/utils/order.util';
import { TranslateService } from '@ngx-translate/core';

export class TableManagementPresenter {
  static formatCurrency(amount: number): string {
    return CurrencyUtil.formatCurrency(amount);
  }

  static getCustomizationDisplay(customization: OrderItem['customization'], translateService?: TranslateService): string[] {
    return OrderUtil.getCustomizationDisplay(customization, translateService);
  }

  static calculateOrderTotal(orderItems: OrderItem[]): number {
    return OrderUtil.calculateOrderTotal(orderItems);
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
