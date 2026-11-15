import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderManagementService } from './order-management.service';
import { OrderManagementPresenter } from './order-management.presenter';
import { Order, OrderItem } from './order-management.types';
import { OrderItemResolverService } from '../../shared/services/order-item-resolver.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [TranslateModule, DatePipe],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderManagementComponent {
  private readonly orderService = inject(OrderManagementService);
  private readonly translateService = inject(TranslateService);
  private readonly orderItemResolver = inject(OrderItemResolverService);

  readonly pendingOrders = this.orderService.pendingOrders;
  readonly servedOrders = this.orderService.servedOrders;
  readonly orderStats = this.orderService.orderStats;
  readonly isLoading = this.orderService.isLoading;
  readonly loadError = this.orderService.loadError;
  readonly serveError = this.orderService.serveError;

  formatCurrency(amount: number): string {
    return OrderManagementPresenter.formatCurrency(amount);
  }

  mergeOrderItems(items: OrderItem[]): OrderItem[] {
    return OrderManagementPresenter.mergeOrderItems(items);
  }

  getCustomizationDisplay(item: OrderItem): string[] {
    return this.orderItemResolver.getLocalizedCustomization(item);
  }

  getItemTotal(item: OrderItem): number {
    return this.orderItemResolver.getItemTotal(item);
  }

  getItemName(item: OrderItem): string {
    return this.orderItemResolver.getLocalizedItemName(item);
  }

  onServeOrder(order: Order): void {
    void this.orderService.serveOrder(order);
  }

  retryLoadOrders(): void {
    this.orderService.retryLoad();
  }

  dismissServeError(): void {
    this.orderService.clearServeError();
  }
}
