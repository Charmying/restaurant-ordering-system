import { CurrencyUtil } from '../../shared/utils/currency.util';

export class MenuManagementPresenter {
  static formatCurrency(amount: number): string {
    return CurrencyUtil.formatCurrency(amount);
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
