export interface OrderItem {
  _id?: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    [key: string]: string | string[] | undefined;
    note?: string;
  };
}

export interface Order {
  _id: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'served';
  token: string;
  createdAt: string;
  __v: number;
}

export interface OrderManagementState {
  pendingOrders: Order[];
  servedOrders: Order[];
}
