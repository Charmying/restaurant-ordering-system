import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoreInfoItem, StoreInfoState } from './store-info.types';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class StoreInfoService {
  private readonly api = inject(ApiService);
  private readonly state = signal<StoreInfoState>({
    items: []
  });

  readonly items = computed(() => this.getSortedItems(this.state().items));
  readonly totalCount = computed(() => this.state().items.length);

  constructor() {
    void this.loadStoreInfo();
  }

  async addInfo(label: string, value: string): Promise<StoreInfoItem | null> {
    const nextOrder = this.getNextOrder();
    try {
      const newItem = await firstValueFrom(
        this.api.post<StoreInfoItem>('/store-info', {
          label,
          value,
          order: nextOrder,
          isStoreName: false,
          isDeletable: true
        })
      );
      this.state.update(current => ({
        ...current,
        items: [...current.items, newItem]
      }));
      return newItem;
    } catch (error) {
      console.error('Failed to create store info', error);
      return null;
    }
  }

  async updateInfo(id: string, label: string, value: string): Promise<StoreInfoItem | null> {
    try {
      const updated = await firstValueFrom(
        this.api.put<StoreInfoItem>(`/store-info/${id}`, { label, value })
      );
      this.state.update(current => ({
        ...current,
        items: current.items.map(item => item._id === id ? updated : item)
      }));
      return updated;
    } catch (error) {
      console.error('Failed to update store info', error);
      return null;
    }
  }

  async deleteInfo(id: string): Promise<void> {
    const currentItem = this.state().items.find(item => item._id === id);
    if (!currentItem || currentItem.isDeletable === false) return;

    try {
      await firstValueFrom(this.api.delete(`/store-info/${id}`));
      this.state.update(current => ({
        ...current,
        items: current.items.filter(item => item._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete store info', error);
    }
  }

  private async loadStoreInfo(): Promise<void> {
    try {
      const items = await firstValueFrom(this.api.get<StoreInfoItem[]>('/store-info'));
      this.state.update(current => ({
        ...current,
        items
      }));
    } catch (error) {
      console.error('Failed to load store info', error);
    }
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
