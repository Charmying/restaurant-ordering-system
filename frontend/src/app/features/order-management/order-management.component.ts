import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderManagementService } from './order-management.service';
import { OrderManagementPresenter } from './order-management.presenter';
import { Order, OrderItem } from './order-management.types';
import { OrderItemResolverService } from '../../shared/services/order-item-resolver.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent {
  private readonly orderService = inject(OrderManagementService);
  private readonly translateService = inject(TranslateService);
  private readonly orderItemResolver = inject(OrderItemResolverService);

  readonly pendingOrders = this.orderService.pendingOrders;
  readonly servedOrders = this.orderService.servedOrders;
  readonly orderStats = this.orderService.orderStats;

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
    this.orderService.serveOrder(order);
  }
}
