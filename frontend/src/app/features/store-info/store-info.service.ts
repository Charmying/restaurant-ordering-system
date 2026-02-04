import { Injectable, signal, computed } from '@angular/core';
import { StoreInfoItem, StoreInfoState } from './store-info.types';
import { MockStoreInfoItems } from './store-info.mock';

@Injectable({
  providedIn: 'root'
})
export class StoreInfoService {
  private readonly state = signal<StoreInfoState>({
    items: []
  });

  readonly items = computed(() => this.getSortedItems(this.state().items));
  readonly totalCount = computed(() => this.state().items.length);

  constructor() {
    this.loadStoreInfo();
  }

  addInfo(label: string, value: string): StoreInfoItem {
    const nextOrder = this.getNextOrder();
    const newItem: StoreInfoItem = {
      _id: this.generateId(),
      label,
      value,
      order: nextOrder,
      isStoreName: false,
      isDeletable: true,
      createdAt: new Date().toISOString(),
      __v: 0
    };

    this.state.update(current => ({
      ...current,
      items: [...current.items, newItem]
    }));

    return newItem;
  }

  updateInfo(id: string, label: string, value: string): StoreInfoItem | null {
    const currentItem = this.state().items.find(item => item._id === id);
    if (!currentItem) return null;

    const updated: StoreInfoItem = {
      ...currentItem,
      label,
      value
    };

    this.state.update(current => ({
      ...current,
      items: current.items.map(item => item._id === id ? updated : item)
    }));

    return updated;
  }

  deleteInfo(id: string): void {
    const currentItem = this.state().items.find(item => item._id === id);
    if (!currentItem || currentItem.isDeletable === false) return;

    this.state.update(current => ({
      ...current,
      items: current.items.filter(item => item._id !== id)
    }));
  }

  private loadStoreInfo(): void {
    this.state.update(current => ({
      ...current,
      items: MockStoreInfoItems
    }));
  }

  private getSortedItems(items: StoreInfoItem[]): StoreInfoItem[] {
    return [...items].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.label.localeCompare(b.label);
    });
  }

  private getNextOrder(): number {
    if (!this.state().items.length) return 0;
    return Math.max(...this.state().items.map(item => item.order ?? 0)) + 1;
  }
}
