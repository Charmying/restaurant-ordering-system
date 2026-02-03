import { Injectable, signal, computed } from '@angular/core';
import { MockPendingOrders, MockServedOrders } from './order-management.mock';
import { Order, OrderManagementState } from './order-management.types';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {
  private readonly state = signal<OrderManagementState>({
    pendingOrders: [],
    servedOrders: []
  });

  readonly pendingOrders = computed(() => this.state().pendingOrders);
  readonly servedOrders = computed(() => this.state().servedOrders);

  readonly orderStats = computed(() => {
    const pending = this.state().pendingOrders;
    const served = this.state().servedOrders;
    const totalOrders = pending.length + served.length;
    const revenue = [...pending, ...served].reduce((sum, order) => sum + order.total, 0);

    return {
      total: totalOrders,
      pending: pending.length,
      served: served.length,
      revenue
    };
  });

  constructor() {
    this.loadOrders();
  }

  private simulateRequest<T>(fn: () => T, delay = 600): void {
    setTimeout(fn, delay);
  }

  private loadOrders(): void {
    this.simulateRequest(() => {
      this.state.update(current => ({
        ...current,
        pendingOrders: this.sortByCreatedAt(MockPendingOrders),
        servedOrders: this.sortByCreatedAt(MockServedOrders)
      }));
    }, 300);
  }

  serveOrder(order: Order): void {
    this.simulateRequest(() => {
      this.state.update(current => {
        const exists = current.pendingOrders.some(item => item._id === order._id);
        if (!exists) return current;

        const pendingOrders = current.pendingOrders.filter(item => item._id !== order._id);
        const servedOrder: Order = { ...order, status: 'served' };

        return {
          ...current,
          pendingOrders,
          servedOrders: [servedOrder, ...current.servedOrders]
        };
      });
    }, 500);
  }

  private sortByCreatedAt(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
}
