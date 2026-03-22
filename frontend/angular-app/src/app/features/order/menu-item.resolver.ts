import { Injectable, inject } from '@angular/core';
import { MenuItem } from './order.types';
import { OrderMenuService } from './order-menu.service';

@Injectable({
  providedIn: 'root',
})
export class MenuItemResolver {
  private readonly menuService = inject(OrderMenuService);

  getById(id: string): MenuItem | undefined {
    return this.menuService.getById(id);
  }
}
