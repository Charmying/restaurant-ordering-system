import { LocalizedString } from '../../shared/types/i18n.types';

export interface MenuCustomOption {
  _id?: string;
  label: LocalizedString;
  price: number | null;
}

export interface MenuCustomField {
  _id?: string;
  name: LocalizedString;
  type: 'single' | 'multiple';
  required: boolean;
  options: MenuCustomOption[];
}

export interface MenuItem {
  _id: string;
  name: LocalizedString;
  price: number;
  description: LocalizedString;
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
  name: LocalizedString;
  price: number | null;
  description: LocalizedString;
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
