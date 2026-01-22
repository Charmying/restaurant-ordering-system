export interface CartItemCustomization {
  fieldName: string;
  selectedOptions: string[];
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  customizations: CartItemCustomization[];
  note: string;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartItemDTO {
  menuItemId: string;
  quantity: number;
  customizations: CartItemCustomization[];
  note: string;
}
