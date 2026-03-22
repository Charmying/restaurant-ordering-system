import { LocalizedString } from '../../shared/types/i18n.types';

export interface StoreInfoItem {
  _id: string;
  label: LocalizedString;
  value: LocalizedString;
  order: number;
  isStoreName?: boolean;
  isDeletable?: boolean;
  createdAt?: string;
  __v?: number;
}

export interface StoreInfoForm {
  _id: string;
  label: LocalizedString;
  value: LocalizedString;
}

export interface StoreInfoState {
  items: StoreInfoItem[];
}
