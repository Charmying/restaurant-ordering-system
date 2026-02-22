import { CurrencyUtil } from '../../shared/utils/currency.util';
import { getLocalizedValue } from '../../shared/utils/i18n.util';
import { LocalizedString, SupportedLanguage } from '../../shared/types/i18n.types';

export class MenuManagementPresenter {
  static formatCurrency(amount: number): string {
    return CurrencyUtil.formatCurrency(amount);
  }

  static isArray(value: unknown): boolean {
    return Array.isArray(value);
  }

  static getLocalizedValue(value: LocalizedString | string, lang: SupportedLanguage): string {
    return getLocalizedValue(value, lang);
  }

  static formatPriceWithDiscount(basePrice: number, discount: number = 0): string {
    if (discount <= 0) return this.formatCurrency(basePrice);

    const discountedPrice = basePrice * (1 - discount / 100);
    return this.formatCurrency(discountedPrice);
  }

  static isHighValue(price: number, threshold: number = 100): boolean {
    return price >= threshold;
  }

  static getQuantityStatus(quantity: number): 'low' | 'normal' | 'high' {
    if (quantity < 10) return 'low';
    if (quantity > 50) return 'high';
    return 'normal';
  }
}
