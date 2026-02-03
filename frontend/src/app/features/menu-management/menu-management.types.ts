export interface MenuCustomOption {
  _id?: string;
  label: string;
  price: number | null;
}

export interface MenuCustomField {
  _id?: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: MenuCustomOption[];
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string[];
  categoryOrder: number;
  image?: string;
  customFields: MenuCustomField[];
  available: boolean;
  createdAt: string;
  __v: number;
}

export interface MenuForm {
  _id?: string;
  name: string;
  price: number | null;
  description: string;
  category: string[];
  categoryOrder: number;
  image?: string;
  customFields: MenuCustomField[];
  available: boolean;
  createdAt?: string;
  __v?: number;
}

export interface MenuManagementState {
  menuItems: MenuItem[];
  selectedCategory: string;
}
