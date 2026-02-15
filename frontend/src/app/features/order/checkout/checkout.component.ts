import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderContextService } from '../order-context.service';
import { CartService } from '../cart.service';
import { OrderCheckoutService } from '../order-checkout.service';
import { CartItem } from '../cart.types';

const API_ERROR_TO_I18N: Record<string, string> = {
  'Invalid table or token': 'features.order.checkoutPage.errors.invalidTableOrToken',
  'Validation failed': 'features.order.checkoutPage.errors.validationFailed',
  'Only pending orders can be served': 'features.order.checkoutPage.errors.onlyPendingCanBeServed',
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  private readonly router = inject(Router);
  private readonly orderContext = inject(OrderContextService);
  private readonly cartService = inject(CartService);
  private readonly checkoutService = inject(OrderCheckoutService);
  private readonly translate = inject(TranslateService);

  /* ========================= State ========================= */

  readonly cart = this.cartService.cart;
  readonly hasValidContext = this.orderContext.hasValidContext;
  readonly tableNumber = this.orderContext.currentTableNumber;

  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly announceText = signal<string>('');

  /* ========================= Computed ========================= */

  readonly canSubmit = computed(
    () =>
      this.hasValidContext() &&
      this.cart().items.length > 0 &&
      !this.submitting() &&
      !this.submitted()
  );

  /* ========================= UI Presenters ========================= */

  getSingleItemPrice(item: CartItem): number {
    return this.checkoutService.getSingleItemPrice(item);
  }

  getItemSubtotal(item: CartItem): number {
    return this.getSingleItemPrice(item) * item.quantity;
  }

  getCustomizationSummary(item: CartItem): string {
    if (!item.customizations?.length) return '';
    return item.customizations.map((c) => c.selectedOptions.join(', ')).join(' / ');
  }

  getDisplayTotal(): number {
    return this.cart().items.reduce((sum, item) => sum + this.getItemSubtotal(item), 0);
  }

  /* ========================= Actions ========================= */

  async submitOrder(): Promise<void> {
    const table = this.orderContext.getTableNumber();
    const token = this.orderContext.getToken();
    if (!table || !token || this.cart().items.length === 0) return;

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.announceText.set('');

    try {
      await this.checkoutService.submitOrder(Number(table), token);
      this.submitted.set(true);
      const successMsg = this.translate.instant('features.order.checkoutPage.success.title');
      this.announceText.set(successMsg);
      this.focusSuccessButton();
    } catch (err: unknown) {
      const body = err && typeof err === 'object' && 'error' in err ? (err as { error: unknown }).error : null;
      const nested = body && typeof body === 'object' && body !== null && 'error' in body ? (body as { error: { message?: string } }).error : null;
      const apiMessage = typeof nested?.message === 'string' ? nested.message : null;
      const i18nKey = apiMessage ? API_ERROR_TO_I18N[apiMessage] : null;
      const displayMessage = i18nKey
        ? this.translate.instant(i18nKey)
        : apiMessage ?? (err instanceof Error ? err.message : null) ?? this.translate.instant('features.order.checkoutPage.errors.submitFailed');
      this.errorMessage.set(displayMessage);
      this.announceText.set(displayMessage);
      this.focusSubmitButton();
    } finally {
      this.submitting.set(false);
    }
  }

  retrySubmit(): void {
    this.errorMessage.set(null);
    this.submitOrder();
  }

  goToMenu(): void {
    this.router.navigate(['/order']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  /* ========================= Private Helpers ========================= */

  private focusSuccessButton(): void {
    setTimeout(() => document.getElementById('checkout-success-button')?.focus(), 0);
  }

  private focusSubmitButton(): void {
    setTimeout(() => document.getElementById('checkout-submit-button')?.focus(), 0);
  }
}
