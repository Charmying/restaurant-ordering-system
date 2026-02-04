import { StoreInfoItem } from './store-info.types';

export class StoreInfoPresenter {
  static getStoreName(items: StoreInfoItem[]): string | null {
    const storeName = items.find(item => item.isStoreName) ?? items.find(item => item.label === '店名');
    return storeName?.value ?? null;
  }
}
