import { BusinessReport } from './business-reports.types';

export const MockBusinessReport: BusinessReport = {
  totalRevenue: 2990,
  totalOrders: 8,
  totalItems: 18,
  avgOrderValue: 374,
  itemStats: [
    {
      name: '麻辣鍋',
      quantity: 6,
      revenue: 1680
    },
    {
      name: '拉麵',
      quantity: 2,
      revenue: 560
    },
    {
      name: '起司薯條',
      quantity: 3,
      revenue: 240
    },
    {
      name: '可樂',
      quantity: 3,
      revenue: 240
    },
    {
      name: '薯條',
      quantity: 2,
      revenue: 150
    },
    {
      name: '珍珠奶茶',
      quantity: 2,
      revenue: 120
    }
  ]
};
