import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EventsWsService } from '../../core/services/events-ws.service';
import { Order, OrderManagementState } from './order-management.types';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {
  private readonly api = inject(ApiService);
  private readonly eventsWs = inject(EventsWsService);
  private readonly state = signal<OrderManagementState>({
    pendingOrders: [],
    servedOrders: []
  });

  readonly pendingOrders = computed(() => this.state().pendingOrders);
  readonly servedOrders = computed(() => this.state().servedOrders);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly serveError = signal<string | null>(null);

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
    void this.loadOrders();
    this.eventsWs.onOrdersChanged.subscribe(() => {
      void this.refreshOrders();
    });
  }

  private async loadOrders(): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);
    try {
      const { pending, served } = await firstValueFrom(
        forkJoin({
          pending: this.api.get<Order[]>('/orders/pending'),
          served: this.api.get<Order[]>('/orders/served')
        })
      );

      this.state.update(current => ({
        ...current,
        pendingOrders: this.sortByCreatedAt(pending.map(order => this.normalizeOrder(order))),
        servedOrders: this.sortByCreatedAt(served.map(order => this.normalizeOrder(order)))
      }));
    } catch {
      this.loadError.set('common.loadError');
    } finally {
      this.isLoading.set(false);
    }
  }

  async serveOrder(order: Order): Promise<void> {
    this.serveError.set(null);
    try {
      const updated = await firstValueFrom(this.api.put<Order>(`/orders/${order._id}/serve`));
      const normalized = this.normalizeOrder(updated);

      this.state.update(current => ({
        ...current,
        pendingOrders: current.pendingOrders.filter(item => item._id !== order._id),
        servedOrders: [normalized, ...current.servedOrders]
      }));
    } catch {
      this.serveError.set('common.actionError');
    }
  }

  retryLoad(): void {
    void this.loadOrders();
  }

  clearServeError(): void {
    this.serveError.set(null);
  }

  async refreshOrders(): Promise<void> {
    await this.loadOrders();
  }

  private sortByCreatedAt(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  private normalizeOrder(order: Order): Order {
    return {
      ...order,
      tableNumber: String(order.tableNumber),
    };
  }
}
