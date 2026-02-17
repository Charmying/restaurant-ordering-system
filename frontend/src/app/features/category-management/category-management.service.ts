import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CategoryManagementState } from './category-management.types';
import { ApiService } from '../../core/services/api.service';
import { EventsWsService } from '../../core/services/events-ws.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryManagementService {
  private readonly api = inject(ApiService);
  private readonly eventsWs = inject(EventsWsService);
  private readonly state = signal<CategoryManagementState>({
    categories: []
  });

  readonly categories = computed(() => this.state().categories);
  readonly totalCount = computed(() => this.state().categories.length);

  constructor() {
    void this.loadCategories();
    this.eventsWs.onMenuChanged.subscribe(() => {
      void this.loadCategories();
    });
  }

  async setCategories(categories: string[]): Promise<void> {
    const previous = this.state().categories;
    this.state.update(current => ({
      ...current,
      categories
    }));

    try {
      const result = await firstValueFrom(
        this.api.put<string[]>('/categories/order', { categories })
      );
      this.state.update(current => ({
        ...current,
        categories: Array.isArray(result) ? result : categories
      }));
    } catch (error) {
      console.error('Failed to update categories', error);
      this.state.update(current => ({
        ...current,
        categories: previous
      }));
    }
  }

  private async loadCategories(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.api.get<string[]>('/categories/order')
      );
      this.state.update(current => ({
        ...current,
        categories: Array.isArray(result) ? result : []
      }));
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  }

  refreshCategories(): void {
    void this.loadCategories();
  }
}
