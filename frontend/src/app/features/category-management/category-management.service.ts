import { Injectable, signal, computed } from '@angular/core';
import { MockCategoryOrder } from './category-management.mock';
import { CategoryManagementState } from './category-management.types';

@Injectable({
  providedIn: 'root'
})
export class CategoryManagementService {
  private readonly state = signal<CategoryManagementState>({
    categories: []
  });

  readonly categories = computed(() => this.state().categories);
  readonly totalCount = computed(() => this.state().categories.length);

  constructor() {
    this.loadCategories();
  }

  setCategories(categories: string[]): void {
    this.state.update(current => ({
      ...current,
      categories
    }));
  }

  private loadCategories(): void {
    this.state.update(current => ({
      ...current,
      categories: [...MockCategoryOrder]
    }));
  }
}
