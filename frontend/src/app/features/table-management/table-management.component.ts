import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { TableManagementService } from './table-management.service';
import { TableManagementPresenter } from './table-management.presenter';
import { Table, OrderItem } from './table-management.types';

@Component({
  selector: 'app-table-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './table-management.component.html',
})
export class TableManagementComponent {
  private readonly tableService = inject(TableManagementService);
  private readonly translateService = inject(TranslateService);

  /* ========================= State ========================= */

  readonly tables = this.tableService.tables;
  readonly tableStats = this.tableService.tableStats;
  readonly selectedTable = this.tableService.selectedTable;
  readonly loadingTables = this.tableService.loadingTables;
  readonly showQRModal = this.tableService.showQRModal;
  readonly showCheckoutModal = this.tableService.showCheckoutModal;
  readonly checkoutTable = this.tableService.checkoutTable;

  /* ========================= Computed ========================= */

  readonly availableTables = computed(() => 
    this.tables().filter(table => table.status === 'available')
  );

  readonly occupiedTables = computed(() => 
    this.tables().filter(table => table.status === 'occupied')
  );

  readonly checkoutTables = computed(() => 
    this.tables().filter(table => table.status === 'checkout')
  );

  /* ========================= UI Presenters ========================= */

  getStatusText(status: Table['status']): string {
    return this.tableService.getStatusText(status);
  }

  isArray(value: any): boolean {
    return TableManagementPresenter.isArray(value);
  }

  formatCurrency(amount: number): string {
    return TableManagementPresenter.formatCurrency(amount);
  }

  getCustomizationDisplay(customization: OrderItem['customization']): string[] {
    return TableManagementPresenter.getCustomizationDisplay(customization, this.translateService);
  }

  calculateOrderTotal(orderItems: OrderItem[]): number {
    return TableManagementPresenter.calculateOrderTotal(orderItems);
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

    try {
      await navigator.clipboard.writeText(table.qrCodeUrl);
      console.log('QR Code link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy QR Code link:', err);
    }
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

  onCloseCheckoutModal(): void {
    this.tableService.closeCheckoutModal();
  }
}
