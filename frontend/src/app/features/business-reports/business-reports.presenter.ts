import { BusinessReport, ReportItemStat } from './business-reports.types';
import { CurrencyUtil } from '../../shared/utils/currency.util';

export class BusinessReportsPresenter {
  static formatCurrency(amount: number): string {
    return CurrencyUtil.formatCurrency(amount);
  }

  static getSortedItemStats(report: BusinessReport): ReportItemStat[] {
    return [...report.itemStats].sort((a, b) => b.revenue - a.revenue);
  }
}
