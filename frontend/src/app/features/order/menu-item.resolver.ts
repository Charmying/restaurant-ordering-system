import { Injectable, signal } from '@angular/core';
import { MenuItem } from './order.types';
import { MockMenu } from './order.mock';

@Injectable({
  providedIn: 'root',
})
export class MenuItemResolver {
  private menuItems = signal<MenuItem[]>(MockMenu);

  getById(id: string): MenuItem | undefined {
    return this.menuItems().find(item => item._id === id);
  }

  getAll(): MenuItem[] {
    return this.menuItems();
  }

  getCustomField(itemId: string, fieldName: string) {
    const item = this.getById(itemId);
    return item?.customFields?.find(f => f.name === fieldName);
  }

  getOptionPrice(itemId: string, fieldName: string, optionLabel: string): number {
    const field = this.getCustomField(itemId, fieldName);
    if (!field) return 0;

    const option = field.options.find(o => o.label === optionLabel);
    return option?.price || 0;
  }

  setMenuItems(items: MenuItem[]): void {
    this.menuItems.set(items);
  }

  addMenuItems(items: MenuItem[]): void {
    this.menuItems.update(existing => [...existing, ...items]);
  }
}
