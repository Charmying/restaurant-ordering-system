import { OrderItem } from '../../features/order-management/order-management.types';

export interface Table {
  _id: string;
  tableNumber: string;
  status: 'available' | 'occupied' | 'checkout';
  qrCodeUrl?: string | null;
  qrCodeToken?: string | null;
  qrCodeImage?: string | null;
  totalAmount: number;
  orderItems: OrderItem[];
  updatedAt: string;
  __v: number;
}

export interface TableManagementState {
  tables: Table[];
  selectedTable: Table | null;
  loadingTables: Set<string>;
  showQRModal: boolean;
  showCheckoutModal: boolean;
  checkoutTable: Table | null;
}
