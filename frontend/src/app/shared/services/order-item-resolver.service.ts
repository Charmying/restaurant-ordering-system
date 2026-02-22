import { Injectable, inject } from '@angular/core';
import { OrderItem } from '../../features/order-management/order-management.types';
import { MenuManagementService } from '../../features/menu-management/menu-management.service';
import { LanguageService } from '../../core/services/language.service';
import { getLocalizedValue } from '../utils/i18n.util';
import { LocalizedString, SupportedLanguage } from '../types/i18n.types';

@Injectable({
  providedIn: 'root'
})
export class OrderItemResolverService {
  private readonly menuService = inject(MenuManagementService);
  private readonly languageService = inject(LanguageService);

  getLocalizedItemName(item: OrderItem): string {
    if (!item.menuItemId) return item.name;
    const menuItem = this.menuService.menuItems().find(m => m._id === item.menuItemId);
    if (!menuItem) return item.name;
    return getLocalizedValue(menuItem.name, this.languageService.current as SupportedLanguage);
  }

  getItemUnitPrice(item: OrderItem): number {
    if (item.subtotal) return item.subtotal / item.quantity;
    if (!item.menuItemId || !item.customization) return item.price;

    const menuItem = this.menuService.menuItems().find(m => m._id === item.menuItemId);
    if (!menuItem?.customFields) return item.price;

    let extraPrice = 0;
    Object.entries(item.customization).forEach(([key, value]) => {
      if (key === 'note') return;
      
      const field = menuItem.customFields?.find(f => this.matchField(f.name, key));
      if (!field) return;

      const options = Array.isArray(value) ? value : [value];
      options.forEach((opt) => {
        if (!opt) return;
        const option = field.options.find(o => this.matchOption(o.label, opt));
        if (option?.price) extraPrice += option.price;
      });
    });
    return item.price + extraPrice;
  }

  getItemTotal(item: OrderItem): number {
    if (item.subtotal) return item.subtotal;
    return this.getItemUnitPrice(item) * item.quantity;
  }

  getLocalizedCustomization(item: OrderItem): string[] {
    if (!item.customization) return [];
    
    if (!item.menuItemId) {
      return this.getFallbackCustomization(item.customization);
    }

    const menuItem = this.menuService.menuItems().find(m => m._id === item.menuItemId);
    if (!menuItem?.customFields) {
      return this.getFallbackCustomization(item.customization);
    }

    const result: string[] = [];
    Object.entries(item.customization).forEach(([key, value]) => {
      if (key === 'note') return;
      
      const field = menuItem.customFields?.find(f => this.matchField(f.name, key));
      if (!field) {
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        result.push(`${key}: ${displayValue}`);
        return;
      }

      const fieldName = getLocalizedValue(field.name, this.languageService.current as SupportedLanguage);
      const options = Array.isArray(value) ? value : [value];
      
      const optionLabels = options.map((opt) => {
        if (!opt) return '';
        const option = field.options.find(o => this.matchOption(o.label, opt));
        return option ? getLocalizedValue(option.label, this.languageService.current as SupportedLanguage) : opt;
      }).filter(Boolean);
      
      result.push(`${fieldName}: ${optionLabels.join(', ')}`);
    });
    
    return result;
  }

  private matchField(fieldName: LocalizedString, key: string): boolean {
    try {
      const parsed = JSON.parse(key);
      if (typeof parsed === 'object' && parsed.zh && parsed.en) {
        return parsed.zh === fieldName.zh && parsed.en === fieldName.en;
      }
    } catch { }

    if (JSON.stringify(fieldName) === key) return true;

    const zh = getLocalizedValue(fieldName, 'zh');
    const en = getLocalizedValue(fieldName, 'en');
    return zh === key || en === key;
  }

  private matchOption(optionLabel: LocalizedString, value: string): boolean {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed.zh && parsed.en) {
        return parsed.zh === optionLabel.zh && parsed.en === optionLabel.en;
      }
    } catch { }

    if (JSON.stringify(optionLabel) === value) return true;

    const zh = getLocalizedValue(optionLabel, 'zh');
    const en = getLocalizedValue(optionLabel, 'en');
    return zh === value || en === value;
  }

  private getFallbackCustomization(customization: OrderItem['customization']): string[] {
    if (!customization) return [];
    
    const result: string[] = [];
    Object.entries(customization).forEach(([key, value]) => {
      if (key === 'note') return;
      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      result.push(`${key}: ${displayValue}`);
    });
    return result;
  }
}
