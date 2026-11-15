import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { TableManagementService } from './table-management.service';
import { TableManagementPresenter } from './table-management.presenter';
import { Table } from './table-management.types';
import { OrderItem } from '../../features/order-management/order-management.types';
import { OrderItemResolverService } from '../../shared/services/order-item-resolver.service';

@Component({
  selector: 'app-table-management',
  standalone: true,
  imports: [FormsModule, TranslateModule, ModalComponent],
  templateUrl: './table-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableManagementComponent {
  private readonly tableService = inject(TableManagementService);
  private readonly translateService = inject(TranslateService);
  private readonly orderItemResolver = inject(OrderItemResolverService);

  /* ========================= State ========================= */

  readonly tables = this.tableService.tables;
  readonly tableStats = this.tableService.tableStats;
  readonly selectedTable = this.tableService.selectedTable;
  readonly loadingTables = this.tableService.loadingTables;
  readonly showQRModal = this.tableService.showQRModal;
  readonly showCheckoutModal = this.tableService.showCheckoutModal;
  readonly checkoutTable = this.tableService.checkoutTable;
  readonly isLoading = this.tableService.isLoading;
  readonly loadError = this.tableService.loadError;
  readonly lastActionError = this.tableService.lastActionError;
  readonly copyState = signal<'idle' | 'copied' | 'error'>('idle');
  private copyResetHandle: ReturnType<typeof setTimeout> | null = null;

  /* ========================= UI Presenters ========================= */

  getStatusText(status: Table['status']): string {
    return this.tableService.getStatusText(status);
  }

  isArray(value: unknown): boolean {
    return TableManagementPresenter.isArray(value);
  }

  formatCurrency(amount: number): string {
    return TableManagementPresenter.formatCurrency(amount);
  }

  getCustomizationDisplay(customization: OrderItem['customization']): string[] {
    return TableManagementPresenter.getCustomizationDisplay(customization, this.translateService);
  }

  calculateOrderTotal(orderItems: OrderItem[]): number {
    return TableManagementPresenter.calculateOrderTotal(orderItems, this.orderItemResolver);
  }

  getItemUnitPrice(orderItem: OrderItem): number {
    return this.orderItemResolver.getItemUnitPrice(orderItem);
  }

  getItemTotal(orderItem: OrderItem): number {
    return this.orderItemResolver.getItemTotal(orderItem);
  }

  /* ========================= Actions ========================= */

  onTableClick(table: Table): void {
    if (this.loadingTables().has(table.tableNumber)) return;

    if (table.status === 'available') {
      this.tableService.toggleTableStatus(table);
    } else if (table.status === 'occupied') {
      this.startCheckout(table);
    }
  }

  onTableKeydown(event: KeyboardEvent, table: Table): void {
    if (event.key === ' ') event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') this.onTableClick(table);
  }

  getTableLabel(table: Table): string {
    const label = this.translateService.instant('features.tableManagement.table.number');
    return `${label} ${table.tableNumber}`;
  }

  startCheckout(table: Table): void {
    this.tableService.startCheckout(table);
  }

  onViewCheckoutDetails(table: Table): void {
    this.tableService.openCheckoutModal(table);
  }

  onViewQRCode(table: Table): void {
    this.tableService.openQRModal(table);
  }

  async onCopyQRLink(): Promise<void> {
    const table = this.selectedTable();
    if (!table?.qrCodeUrl) return;

    if (this.copyResetHandle !== null) {
      clearTimeout(this.copyResetHandle);
      this.copyResetHandle = null;
    }

    try {
      await navigator.clipboard.writeText(table.qrCodeUrl);
      this.copyState.set('copied');
    } catch {
      this.copyState.set('error');
    }

    this.copyResetHandle = setTimeout(() => {
      this.copyState.set('idle');
      this.copyResetHandle = null;
    }, 2500);
  }

  onDownloadQRCode(): void {
    const table = this.selectedTable();
    if (!table?.qrCodeImage) return;

    const link = document.createElement('a');
    link.href = table.qrCodeImage;
    link.download = `table-${table.tableNumber}-qrcode.png`;
    link.click();
  }

  onCompleteCheckout(): void {
    const table = this.checkoutTable();
    if (table) {
      this.tableService.completeCheckout(table);
    }
  }

  onResumeOrdering(): void {
    const table = this.checkoutTable();
    if (table) {
      this.tableService.resumeOrdering(table);
    }
  }

  onCloseQRModal(): void {
    this.tableService.closeQRModal();
  }

  getCopyBtnClass(): string {
    const base = 'flex-1 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-[rgb(var(--success-contrast))] rounded-lg sm:rounded-xl font-semibold transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-xl text-xs sm:text-sm disabled:opacity-80 disabled:cursor-default';
    switch (this.copyState()) {
      case 'copied': return `${base} bg-green-600 hover:bg-green-700`;
      case 'error': return `${base} bg-[rgb(var(--destructive))] hover:bg-[rgb(var(--destructive))]/90`;
      default: return `${base} bg-[rgb(var(--success))] hover:bg-[rgb(var(--success-hover))]`;
    }
  }

  onCloseCheckoutModal(): void {
    this.tableService.closeCheckoutModal();
  }

  retryLoadTables(): void {
    this.tableService.retryLoad();
  }

  dismissActionError(): void {
    this.tableService.clearActionError();
  }
}
