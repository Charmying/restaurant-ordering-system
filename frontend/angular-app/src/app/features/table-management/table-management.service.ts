import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Table, TableManagementState } from './table-management.types';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TableManagementService {
  private readonly translateService = inject(TranslateService);
  private readonly api = inject(ApiService);
  private readonly state = signal<TableManagementState>({
    tables: [],
    selectedTable: null,
    loadingTables: new Set(),
    showQRModal: false,
    showCheckoutModal: false,
    checkoutTable: null
  });

  readonly tables = computed(() => this.state().tables);
  readonly selectedTable = computed(() => this.state().selectedTable);
  readonly loadingTables = computed(() => this.state().loadingTables);
  readonly showQRModal = computed(() => this.state().showQRModal);
  readonly showCheckoutModal = computed(() => this.state().showCheckoutModal);
  readonly checkoutTable = computed(() => this.state().checkoutTable);

  readonly tableStats = computed(() => {
    const tables = this.state().tables;
    return {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      checkout: tables.filter(t => t.status === 'checkout').length
    };
  });

  constructor() {
    void this.loadTables();
  }

  private async loadTables(): Promise<void> {
    try {
      const tables = await firstValueFrom(this.api.get<Table[]>('/tables'));
      this.state.update(current => ({
        ...current,
        tables: tables
          .map(table => this.normalizeTable(table))
          .sort((a, b) => parseInt(a.tableNumber) - parseInt(b.tableNumber))
      }));
    } catch (error) {
      console.error('Failed to load tables', error);
    }
  }

  toggleTableStatus(table: Table): void {
    const tableNumber = table.tableNumber;

    this.addLoadingTable(tableNumber);

    void this.activateTable(tableNumber);
  }

  startCheckout(table: Table): void {
    const tableNumber = table.tableNumber;

    this.addLoadingTable(tableNumber);

    void this.requestCheckout(tableNumber);
  }

  completeCheckout(table: Table): void {
    const tableNumber = table.tableNumber;

    this.addLoadingTable(tableNumber);

    void this.finishCheckout(tableNumber);
  }

  openQRModal(table: Table): void {
    this.state.update(current => ({
      ...current,
      selectedTable: table,
      showQRModal: true
    }));
  }

  closeQRModal(): void {
    this.state.update(current => ({
      ...current,
      showQRModal: false,
      selectedTable: null
    }));
  }

  openCheckoutModal(table: Table): void {
    this.state.update(current => ({
      ...current,
      checkoutTable: table,
      showCheckoutModal: true
    }));
    void this.refreshCheckoutTable(table.tableNumber);
  }

  closeCheckoutModal(): void {
    this.state.update(current => ({
      ...current,
      showCheckoutModal: false,
      checkoutTable: null
    }));
  }

  resumeOrdering(table: Table): void {
    this.addLoadingTable(table.tableNumber);

    void this.resetAndReactivate(table.tableNumber);
  }

  private addLoadingTable(tableNumber: string): void {
    this.state.update(current => ({
      ...current,
      loadingTables: new Set([...current.loadingTables, tableNumber])
    }));
  }

  private removeLoadingTable(tableNumber: string): void {
    this.state.update(current => {
      const newLoadingTables = new Set(current.loadingTables);
      newLoadingTables.delete(tableNumber);
      return {
        ...current,
        loadingTables: newLoadingTables
      };
    });
  }

  private async activateTable(tableNumber: string): Promise<void> {
    try {
      const updated = await firstValueFrom(
        this.api.post<Table>(`/tables/${tableNumber}/activate`)
      );
      const normalized = this.normalizeTable(updated);
      this.updateTableState(normalized, { openQrModal: true });
    } catch (error) {
      console.error('Failed to activate table', error);
    } finally {
      this.removeLoadingTable(tableNumber);
    }
  }

  private async requestCheckout(tableNumber: string): Promise<void> {
    try {
      const updated = await firstValueFrom(
        this.api.post<Table>(`/tables/${tableNumber}/checkout`)
      );
      const normalized = this.normalizeTable(updated);
      const orderItems = await this.loadOrderItemsForTable(tableNumber);

      this.updateTableState(
        { ...normalized, orderItems },
        { openCheckoutModal: true }
      );
    } catch (error) {
      console.error('Failed to start checkout', error);
    } finally {
      this.removeLoadingTable(tableNumber);
    }
  }

  private async finishCheckout(tableNumber: string): Promise<void> {
    try {
      const updated = await firstValueFrom(
        this.api.post<Table>(`/tables/${tableNumber}/complete-checkout`)
      );
      const normalized = this.normalizeTable(updated);
      this.updateTableState(normalized, { closeCheckoutModal: true });
    } catch (error) {
      console.error('Failed to complete checkout', error);
    } finally {
      this.removeLoadingTable(tableNumber);
    }
  }

  private async resetAndReactivate(tableNumber: string): Promise<void> {
    try {
      await firstValueFrom(this.api.post(`/tables/${tableNumber}/force-reset`));
      const updated = await firstValueFrom(
        this.api.post<Table>(`/tables/${tableNumber}/activate`)
      );
      const normalized = this.normalizeTable(updated);
      this.updateTableState(normalized, { closeCheckoutModal: true, openQrModal: true });
    } catch (error) {
      console.error('Failed to resume ordering', error);
    } finally {
      this.removeLoadingTable(tableNumber);
    }
  }

  private async loadOrderItemsForTable(tableNumber: string): Promise<Table['orderItems']> {
    try {
      const orders = await firstValueFrom(this.api.get<Array<{ items: Table['orderItems'] }>>(`/tables/${tableNumber}/orders`));
      return orders.flatMap(order => order.items ?? []);
    } catch (error) {
      console.error('Failed to load table orders', error);
      return [];
    }
  }

  private async refreshCheckoutTable(tableNumber: string): Promise<void> {
    const orderItems = await this.loadOrderItemsForTable(tableNumber);
    this.state.update(current => {
      const checkoutTable = current.tables.find(t => t.tableNumber === tableNumber);
      if (!checkoutTable) return current;
      const updatedTable = { ...checkoutTable, orderItems };
      return {
        ...current,
        checkoutTable: updatedTable,
        tables: current.tables.map(t => (t.tableNumber === tableNumber ? updatedTable : t))
      };
    });
  }

  private normalizeTable(table: Table): Table {
    return {
      ...table,
      tableNumber: String(table.tableNumber),
      totalAmount: table.totalAmount ?? 0,
      orderItems: table.orderItems ?? [],
      qrCodeUrl: table.qrCodeUrl ?? null,
      qrCodeToken: table.qrCodeToken ?? null,
      qrCodeImage: table.qrCodeImage ?? null,
    };
  }

  private updateTableState(
    updatedTable: Table,
    options?: { openQrModal?: boolean; openCheckoutModal?: boolean; closeCheckoutModal?: boolean }
  ): void {
    this.state.update(current => {
      const tables = current.tables.map(t => (t._id === updatedTable._id ? updatedTable : t));
      const next: TableManagementState = {
        ...current,
        tables,
      };

      if (options?.openQrModal) {
        next.selectedTable = updatedTable;
        next.showQRModal = true;
      }

      if (options?.openCheckoutModal) {
        next.checkoutTable = updatedTable;
        next.showCheckoutModal = true;
      }

      if (options?.closeCheckoutModal) {
        next.checkoutTable = null;
        next.showCheckoutModal = false;
      }

      return next;
    });
  }

  getStatusColor(status: Table['status']): { bg: string; text: string; border: string } {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800'
        };
      case 'occupied':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800'
        };
      case 'checkout':
        return {
          bg: 'bg-[rgb(var(--accent))]/10',
          text: 'text-[rgb(var(--accent))]',
          border: 'border-[rgb(var(--accent))]/30'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          text: 'text-gray-700 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800'
        };
    }
  }

  getStatusText(status: Table['status']): string {
    switch (status) {
      case 'available':
        return this.translateService.instant('features.tableManagement.table.status.available');
      case 'occupied':
        return this.translateService.instant('features.tableManagement.table.status.occupied');
      case 'checkout':
        return this.translateService.instant('features.tableManagement.table.status.checkout');
      default:
        return this.translateService.instant('common.noData');
    }
  }
}
