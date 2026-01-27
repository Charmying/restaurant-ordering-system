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
}
