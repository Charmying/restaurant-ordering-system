import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageToggleComponent } from '../../components/language-toggle/language-toggle.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { FullScreenModalComponent } from '../../components/full-screen-modal/full-screen-modal.component';
import { ServiceBellComponent } from '../../../features/order/service-bell/service-bell.component';
import { CartService } from '../../../features/order/cart.service';
import { MenuItemResolver } from '../../../features/order/menu-item.resolver';
import { CartItem } from '../../../features/order/cart.types';
import { StoreInfoService } from '../../../features/store-info/store-info.service';

@Component({
  selector: 'app-order-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, LanguageToggleComponent, ThemeToggleComponent, FullScreenModalComponent, ServiceBellComponent],
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
})
export class OrderHeaderComponent {
  private readonly router = inject(Router);
  private readonly storeInfoService = inject(StoreInfoService);
  protected cartService = inject(CartService);
  private menuItemResolver = inject(MenuItemResolver);
  readonly storeName = this.storeInfoService.storeName;

  /* ========================= State ========================= */

  showCart = signal(false);
  showRemoveConfirm = signal(false);
  selectedRemoveItemId = signal<string | null>(null);

  /* ========================= Computed ========================= */

  cart = this.cartService.cart;
  readonly cartDisplayTotal = computed(() => this.cart().items.reduce((sum, item) => sum + this.getItemSubtotal(item), 0));

  /* ========================= Cart Actions ========================= */

  openCart(): void {
    this.showCart.set(true);
  }

  closeCart(): void {
    this.showCart.set(false);
  }

  onUpdateQuantity(itemId: string, quantity: number): void {
    if (quantity >= 1) {
      this.cartService.updateQuantity(itemId, quantity);
    }
  }

  onRemoveItem(itemId: string): void {
    this.selectedRemoveItemId.set(itemId);
    this.showRemoveConfirm.set(true);
  }

  confirmRemoveItem(): void {
    const itemId = this.selectedRemoveItemId();
    if (itemId) {
      this.cartService.removeItem(itemId);
    }
    this.closeRemoveConfirm();
  }

  closeRemoveConfirm(): void {
    this.showRemoveConfirm.set(false);
    this.selectedRemoveItemId.set(null);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onCheckout(): void {
    this.closeCart();
    void this.router.navigate(['/order/checkout']);
  }

  /* ========================= Presenters ========================= */

  getCustomizationPriceDisplay(item: CartItem): number {
    const menuItem = this.menuItemResolver.getById(item.menuItemId);
    if (!menuItem) return 0;

    let price = 0;
    item.customizations.forEach((custom) => {
      const field = menuItem.customFields?.find((f) => f.name === custom.fieldName);
      if (!field) return;

      custom.selectedOptions.forEach((optionLabel) => {
        const option = field.options.find((o) => o.label === optionLabel);
        if (option?.price) {
          price += option.price;
        }
      });
    });

    return price;
  }

  getSingleItemPrice(item: CartItem): number {
    const menuItem = this.menuItemResolver.getById(item.menuItemId);
    if (!menuItem) return item.price;

    return item.price + this.getCustomizationPriceDisplay(item);
  }

  getItemSubtotal(item: CartItem): number {
    return this.getSingleItemPrice(item) * item.quantity;
  }
}
