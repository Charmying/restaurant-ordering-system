import { Injectable, signal, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Table, TableManagementState } from './table-management.types';
import { MockTableManagement } from './table-management.mock';

@Injectable({
  providedIn: 'root'
})
export class TableManagementService {
  private readonly translateService = inject(TranslateService);
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
    this.loadTables();
  }

  private simulateRequest<T>(fn: () => T, delay = 600): void {
    setTimeout(fn, delay);
  }

  private loadTables(): void {
    this.simulateRequest(() => {
      this.state.update(current => ({
        ...current,
        tables: MockTableManagement.sort((a, b) => 
          parseInt(a.tableNumber) - parseInt(b.tableNumber)
        )
      }));
    }, 300);
  }

  toggleTableStatus(table: Table): void {
    const tableNumber = table.tableNumber;

    this.addLoadingTable(tableNumber);

    this.simulateRequest(() => {
      this.state.update(current => {
        const updatedTables = current.tables.map(t => {
          if (t.tableNumber === tableNumber) {
            const newStatus = t.status === 'available' ? 'occupied' : 'available';
            const updatedTable = { ...t, status: newStatus as Table['status'] };

            if (newStatus === 'occupied' && !t.qrCodeUrl) {
              updatedTable.qrCodeUrl = `https://restaurant.example.com/menu?table=${tableNumber}&token=${this.generateToken()}`;
              updatedTable.qrCodeImage = t.qrCodeImage || MockTableManagement.find(mt => mt.tableNumber === '1')?.qrCodeImage;
            }

            return updatedTable;
          }
          return t;
        });

        const toggledTable = updatedTables.find(t => t.tableNumber === tableNumber);
        if (toggledTable?.status === 'occupied') {
          return {
            ...current,
            tables: updatedTables,
            selectedTable: toggledTable,
            showQRModal: true
          };
        }

        return {
          ...current,
          tables: updatedTables
        };
      });

      this.removeLoadingTable(tableNumber);
    }, 800);
  }

  startCheckout(table: Table): void {
    const tableNumber = table.tableNumber;

    this.addLoadingTable(tableNumber);

    this.simulateRequest(() => {
      this.state.update(current => {
        const updatedTables = current.tables.map(t => {
          if (t.tableNumber === tableNumber) {
            return { ...t, status: 'checkout' as const };
          }
          return t;
        });

        const checkoutTable = updatedTables.find(t => t.tableNumber === tableNumber);

        return {
          ...current,
          tables: updatedTables,
          checkoutTable: checkoutTable || null,
          showCheckoutModal: true
        };
      });

      this.removeLoadingTable(tableNumber);
    }, 600);
  }

  completeCheckout(table: Table): void {
    const tableNumber = table.tableNumber;

    this.addLoadingTable(tableNumber);

    this.simulateRequest(() => {
      this.state.update(current => {
        const updatedTables = current.tables.map(t => {
          if (t.tableNumber === tableNumber) {
            return { 
              ...t, 
              status: 'available' as const,
              totalAmount: 0,
              orderItems: [],
              qrCodeUrl: undefined,
              qrCodeToken: undefined
            };
          }
          return t;
        });

        return {
          ...current,
          tables: updatedTables,
          checkoutTable: null,
          showCheckoutModal: false
        };
      });

      this.removeLoadingTable(tableNumber);
    }, 1000);
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

    this.simulateRequest(() => {
      this.state.update(current => ({
        ...current,
        tables: current.tables.map(t => 
          t._id === table._id ? { ...t, status: 'occupied' as const, updatedAt: new Date().toISOString() } : t
        ),
        showCheckoutModal: false,
        checkoutTable: null
      }));

      this.removeLoadingTable(table.tableNumber);
    }, 500);
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

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
