export interface CreateOrderItemDto {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: Record<string, unknown>;
  subtotal: number;
}

export interface CreateOrderDto {
  tableNumber: number;
  items: CreateOrderItemDto[];
  total: number;
  token: string;
}

export interface CreatedOrderResponse {
  _id: string;
  tableNumber: number;
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    customization?: Record<string, unknown>;
    subtotal: number;
  }>;
  total: number;
  status: string;
  token: string;
  createdAt: string;
  updatedAt?: string;
}
