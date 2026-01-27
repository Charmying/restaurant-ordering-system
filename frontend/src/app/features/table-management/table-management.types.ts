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

export interface OrderItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    [key: string]: string | string[] | undefined;
    note?: string;
  };
}

export interface TableManagementState {
  tables: Table[];
  selectedTable: Table | null;
  loadingTables: Set<string>;
  showQRModal: boolean;
  showCheckoutModal: boolean;
  checkoutTable: Table | null;
}
