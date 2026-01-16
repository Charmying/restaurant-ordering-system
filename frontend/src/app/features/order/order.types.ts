export type CustomFieldType = 'single' | 'multiple';

export interface CustomOption {
  _id?: string;
  label: string;
  price?: number;
}

export interface CustomField {
  _id: string;
  name: string;
  type: CustomFieldType;
  required: boolean;
  options: CustomOption[];
}

export interface MenuItem {
  // System
  _id: string;
  __v?: number;
  createdAt?: string;
  available?: boolean;

  // Core info
  name: string;
  description?: string;
  price: number;
  image?: string;

  // Category
  category: string | string[];
  categoryOrder?: number;

  // Customization
  customFields?: CustomField[];
}

export interface CustomizationState {
  selections: Record<string, string | string[]>;
  note: string;
}
