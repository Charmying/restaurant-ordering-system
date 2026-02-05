import { Injectable, signal, computed } from '@angular/core';
import { BusinessReport, BusinessReportsState, ReportDateRange } from './business-reports.types';
import { MockBusinessReport } from './business-reports.mock';

@Injectable({
  providedIn: 'root'
})
export class BusinessReportsService {
  private readonly state = signal<BusinessReportsState>({
    report: MockBusinessReport,
    reportDateRange: 'today',
    customStartDate: '',
    customEndDate: ''
  });

  readonly report = computed(() => this.state().report);
  readonly reportDateRange = computed(() => this.state().reportDateRange);
  readonly customStartDate = computed(() => this.state().customStartDate);
  readonly customEndDate = computed(() => this.state().customEndDate);

  setDateRange(range: ReportDateRange): void {
    this.state.update(current => ({
      ...current,
      reportDateRange: range
    }));
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
    this.state.update(current => ({
      ...current
    }));
  }

  resetReports(): void {
    this.state.update(current => ({
      ...current,
      report: {
        ...current.report,
        totalRevenue: 0,
        totalOrders: 0,
        totalItems: 0,
        avgOrderValue: 0,
        itemStats: []
      }
    }));
  }

  setReport(report: BusinessReport): void {
    this.state.update(current => ({
      ...current,
      report
    }));
  }
}
