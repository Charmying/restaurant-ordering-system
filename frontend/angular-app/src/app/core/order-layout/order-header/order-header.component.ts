import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  imports: [TranslateModule, LanguageToggleComponent, ThemeToggleComponent, FullScreenModalComponent, ServiceBellComponent, DecimalPipe],
  templateUrl: './order-header.component.html',
  styleUrl: './order-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHeaderComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly storeInfoService = inject(StoreInfoService);
  protected cartService = inject(CartService);
  readonly storeName = this.storeInfoService.storeName;

  /* ========================= State ========================= */

  readonly showCart = signal(false);
  readonly showRemoveConfirm = signal(false);
  readonly selectedRemoveItemId = signal<string | null>(null);

  /* ========================= Computed ========================= */

  readonly cart = this.cartService.cart;
  readonly cartDisplayTotal = computed(() => this.cart().items.reduce((sum, item) => sum + item.subtotal, 0));

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
    const queryParams = { ...this.route.snapshot.queryParams };
    void this.router.navigate(['/order/checkout'], { queryParams });
  }

  /* ========================= Presenters ========================= */

  getSingleItemPrice(item: CartItem): number {
    return item.subtotal / item.quantity;
  }

  getItemSubtotal(item: CartItem): number {
    return item.subtotal;
  }
}
