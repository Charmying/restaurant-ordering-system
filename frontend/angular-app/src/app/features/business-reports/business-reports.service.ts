import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BusinessReport, BusinessReportsState, ReportDateRange } from './business-reports.types';
import { ApiService } from '../../core/services/api.service';
import { MenuManagementService } from '../menu-management/menu-management.service';
import { LanguageService } from '../../core/services/language.service';
import { getLocalizedValue } from '../../shared/utils/i18n.util';
import { SupportedLanguage } from '../../shared/types/i18n.types';

@Injectable({
  providedIn: 'root'
})
export class BusinessReportsService {
  private readonly api = inject(ApiService);
  private readonly menuService = inject(MenuManagementService);
  private readonly languageService = inject(LanguageService);

  private readonly state = signal<BusinessReportsState>({
    report: {
      totalRevenue: 0,
      totalOrders: 0,
      totalItems: 0,
      avgOrderValue: 0,
      itemStats: []
    },
    reportDateRange: 'today',
    customStartDate: '',
    customEndDate: ''
  });

  readonly report = computed(() => this.state().report);
  readonly reportDateRange = computed(() => this.state().reportDateRange);
  readonly customStartDate = computed(() => this.state().customStartDate);
  readonly customEndDate = computed(() => this.state().customEndDate);

  constructor() {
    void this.fetchReports();
  }

  setDateRange(range: ReportDateRange): void {
    this.state.update(current => ({
      ...current,
      reportDateRange: range
    }));
    void this.fetchReports();
  }

  setCustomStartDate(value: string): void {
    this.state.update(current => ({
      ...current,
      customStartDate: value
    }));
  }

  setCustomEndDate(value: string): void {
    this.state.update(current => ({
      ...current,
      customEndDate: value
    }));
  }

  applyCustomDateRange(): void {
    void this.fetchReports();
  }

  async resetReports(): Promise<boolean> {
    try {
      await firstValueFrom(this.api.post('/orders/reset'));
      await this.fetchReports();
      return true;
    } catch (error) {
      console.error('Failed to reset reports', error);
      return false;
    }
  }

  setReport(report: BusinessReport): void {
    this.state.update(current => ({
      ...current,
      report
    }));
  }

  private async fetchReports(): Promise<void> {
    const range = this.state().reportDateRange;
    const params: Record<string, string> = { period: range };
    if (range === 'custom') {
      if (this.state().customStartDate) params['startDate'] = this.state().customStartDate;
      if (this.state().customEndDate) params['endDate'] = this.state().customEndDate;
    }

    try {
      const response = await firstValueFrom(
        this.api.get<{ orders: any[]; summary: { totalRevenue: number; totalOrders: number; avgOrderValue: number } }>(
          '/orders/reports',
          { params }
        )
      );

      const report = this.buildReport(response.orders ?? [], response.summary);
      this.setReport(report);
    } catch (error) {
      console.error('Failed to load business reports', error);
    }
  }

  private buildReport(orders: Array<{ items: Array<{ menuItemId?: string; name: string; price: number; quantity: number; subtotal?: number }> }>, summary?: { totalRevenue: number; totalOrders: number; avgOrderValue: number }): BusinessReport {
    const itemMap = new Map<string, { menuItemId?: string; quantity: number; revenue: number }>();
    let totalItems = 0;

    orders.forEach(order => {
      order.items?.forEach(item => {
        totalItems += item.quantity;
        const revenue = item.subtotal ?? item.price * item.quantity;

        const key = item.menuItemId || item.name;
        const existing = itemMap.get(key) ?? { menuItemId: item.menuItemId, quantity: 0, revenue: 0 };

        itemMap.set(key, {
          menuItemId: item.menuItemId,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + revenue
        });
      });
    });

    const itemStats = Array.from(itemMap.entries()).map(([key, data]) => {
      let name = key;

      if (data.menuItemId) {
        const menuItem = this.menuService.menuItems().find(m => m._id === data.menuItemId);
        if (menuItem) {
          name = getLocalizedValue(menuItem.name, this.languageService.current as SupportedLanguage);
        }
      }

      return {
        name,
        quantity: data.quantity,
        revenue: data.revenue
      };
    });

    return {
      totalRevenue: summary?.totalRevenue ?? 0,
      totalOrders: summary?.totalOrders ?? 0,
      totalItems,
      avgOrderValue: summary?.avgOrderValue ?? 0,
      itemStats
    };
  }
}
