export type ReportDateRange = 'today' | 'week' | 'month' | 'all' | 'custom';

export interface ReportItemStat {
  name: string;
  quantity: number;
  revenue: number;
}

export interface BusinessReport {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  avgOrderValue: number;
  itemStats: ReportItemStat[];
}

export interface BusinessReportsState {
  report: BusinessReport;
  reportDateRange: ReportDateRange;
  customStartDate: string;
  customEndDate: string;
}
