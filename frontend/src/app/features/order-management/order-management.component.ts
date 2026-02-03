import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderManagementService } from './order-management.service';
import { OrderManagementPresenter } from './order-management.presenter';
import { Order, OrderItem } from './order-management.types';

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

  /* ========================= State ========================= */

  readonly pendingOrders = this.orderService.pendingOrders;
  readonly servedOrders = this.orderService.servedOrders;
  readonly orderStats = this.orderService.orderStats;

  /* ========================= UI Presenters ========================= */

  formatCurrency(amount: number): string {
    return OrderManagementPresenter.formatCurrency(amount);
  }

  mergeOrderItems(items: OrderItem[]): OrderItem[] {
    return OrderManagementPresenter.mergeOrderItems(items);
  }

  getCustomizationDisplay(customization: OrderItem['customization']): string[] {
    return OrderManagementPresenter.getCustomizationDisplay(customization, this.translateService);
  }

  onServeOrder(order: Order): void {
    this.orderService.serveOrder(order);
  }
}
