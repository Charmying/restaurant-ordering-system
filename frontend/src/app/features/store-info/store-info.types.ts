export interface StoreInfoItem {
  _id: string;
  label: string;
  value: string;
  order: number;
  isStoreName?: boolean;
  isDeletable?: boolean;
  createdAt?: string;
  __v?: number;
}

export interface StoreInfoForm {
  _id: string;
  label: string;
  value: string;
}

export interface StoreInfoState {
  items: StoreInfoItem[];
}
