import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { BusinessReportsService } from './business-reports.service';
import { BusinessReportsPresenter } from './business-reports.presenter';
import { ReportDateRange } from './business-reports.types';

@Component({
  selector: 'app-business-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './business-reports.component.html',
  styleUrls: ['./business-reports.component.scss'],
})
export class BusinessReportsComponent {
  private readonly reportsService = inject(BusinessReportsService);
  private readonly translateService = inject(TranslateService);

  /* ========================= State ========================= */

  readonly report = this.reportsService.report;
  readonly reportDateRange = this.reportsService.reportDateRange;
  readonly customStartDate = this.reportsService.customStartDate;
  readonly customEndDate = this.reportsService.customEndDate;

  /* ========================= Computed ========================= */

  readonly sortedItemStats = computed(() =>
    BusinessReportsPresenter.getSortedItemStats(this.report())
  );

  readonly isCustomRange = computed(() => this.reportDateRange() === 'custom');

  readonly dateRangeOptions: ReadonlyArray<{ value: ReportDateRange; label: string }> = [
    { value: 'today', label: 'features.businessReports.range.today' },
    { value: 'week', label: 'features.businessReports.range.week' },
    { value: 'month', label: 'features.businessReports.range.month' },
    { value: 'all', label: 'features.businessReports.range.all' },
    { value: 'custom', label: 'features.businessReports.range.custom' },
  ];

  readonly statsCards = computed(() => [
    { label: 'features.businessReports.stats.totalItems', value: this.report().totalItems, format: 'number' },
    { label: 'features.businessReports.stats.totalOrders', value: this.report().totalOrders, format: 'number' },
    { label: 'features.businessReports.stats.totalRevenue', value: this.report().totalRevenue, format: 'currency' },
    { label: 'features.businessReports.stats.avgOrderValue', value: this.report().avgOrderValue, format: 'currency' },
  ] as const);

  /* ========================= Local State ========================= */

  showResetModal = false;
  resetPassword = '';
  showAlertModal = false;
  alertMessage = '';

  /* ========================= Actions ========================= */

  setDateRange(range: ReportDateRange): void {
    this.reportsService.setDateRange(range);
  }

  updateStartDate(value: string): void {
    this.reportsService.setCustomStartDate(value);
  }

  updateEndDate(value: string): void {
    this.reportsService.setCustomEndDate(value);
  }

  applyCustomDateRange(): void {
    if (!this.customStartDate() || !this.customEndDate()) {
      this.showAlert('features.businessReports.validation.dateRequired');
      return;
    }
    if (this.customStartDate() > this.customEndDate()) {
      this.showAlert('features.businessReports.validation.invalidRange');
      return;
    }
    this.reportsService.applyCustomDateRange();
  }

  /* ========================= UI Presenters ========================= */

  formatCurrency(amount: number): string {
    return BusinessReportsPresenter.formatCurrency(amount);
  }

  formatValue(value: number, format: 'number' | 'currency'): string | number {
    return format === 'currency' ? this.formatCurrency(value) : value;
  }

  getRankClass(index: number): string {
    const classes = 'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold';
    if (index === 0) return `${classes} bg-[rgb(var(--rank-1-bg))] text-[rgb(var(--rank-1-text))]`;
    if (index === 1) return `${classes} bg-[rgb(var(--rank-2-bg))] text-[rgb(var(--rank-2-text))]`;
    if (index === 2) return `${classes} bg-[rgb(var(--rank-3-bg))] text-[rgb(var(--rank-3-text))]`;
    return `${classes} bg-[rgb(var(--surface-muted))] text-[rgb(var(--text-secondary))]`;
  }

  /* ========================= Modal Actions ========================= */

  openResetModal(): void {
    this.resetPassword = '';
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
  }

  async resetReports(): Promise<void> {
    if (!this.resetPassword) {
      this.showAlert('features.businessReports.validation.resetPassword');
      return;
    }
    const ok = await this.reportsService.resetReports();
    if (!ok) {
      this.showAlert('features.businessReports.errors.resetFailed');
      return;
    }
    this.closeResetModal();
  }

  showAlert(messageKey: string): void {
    this.alertMessage = this.translateService.instant(messageKey);
    this.showAlertModal = true;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
  }
}
