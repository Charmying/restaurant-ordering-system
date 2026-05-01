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
  readonly loadError = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

  constructor() {
    void this.loadCategories();
    this.eventsWs.onMenuChanged.subscribe(() => {
      void this.loadCategories();
    });
  }

  async setCategories(categories: string[]): Promise<void> {
    this.actionError.set(null);
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
    } catch {
      this.state.update(current => ({
        ...current,
        categories: previous
      }));
      this.actionError.set('common.actionError');
    }
  }

  private async loadCategories(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.api.get<string[]>('/categories/order')
      );
      this.loadError.set(null);
      this.state.update(current => ({
        ...current,
        categories: Array.isArray(result) ? result : []
      }));
    } catch {
      this.loadError.set('common.loadError');
    }
  }

  refreshCategories(): void {
    void this.loadCategories();
  }

  clearActionError(): void {
    this.actionError.set(null);
  }
}
