import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MenuCustomField, MenuItem, MenuManagementState, MenuForm } from './menu-management.types';
import { ApiService } from '../../core/services/api.service';
import { CategoryManagementService } from '../category-management/category-management.service';

const allCategory = '__all__';

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {
  private readonly api = inject(ApiService);
  private readonly categoryService = inject(CategoryManagementService);
  private readonly state = signal<MenuManagementState>({
    menuItems: [],
    selectedCategory: allCategory
  });

  readonly allCategoryValue = allCategory;
  readonly menuItems = computed(() => this.state().menuItems);
  readonly selectedCategory = computed(() => this.state().selectedCategory);

  readonly menuCategories = computed(() => [allCategory, ...this.getSortedCategories()]);

  readonly filteredMenuItems = computed(() => {
    const selected = this.state().selectedCategory;
    const items = this.getSortedMenuItems();

    if (selected === allCategory) return items;
    return items.filter(item => item.category.includes(selected));
  });

  constructor() {
    void this.loadMenuItems();
  }

  setSelectedCategory(category: string): void {
    this.state.update(current => ({
      ...current,
      selectedCategory: category
    }));
  }

  createEmptyForm(): MenuForm {
    return {
      name: '',
      price: null,
      description: '',
      category: ['其他'],
      categoryOrder: 999,
      image: '',
      customFields: [],
      available: true
    };
  }

  createEmptyCustomField(): MenuCustomField {
    return { name: '', type: 'single', required: false, options: [] };
  }

  async saveMenuItem(form: MenuForm, isEdit: boolean): Promise<{ success: boolean; error?: string }> {
    if (!form.name || !form.price || form.price <= 0) {
      return { success: false, error: 'features.menuManagement.validation.required' };
    }

    const payload = this.normalizeForm(form);
    if (!payload) {
      return { success: false, error: 'features.menuManagement.validation.required' };
    }

    try {
      if (isEdit && form._id) {
        const updated = await firstValueFrom(
          this.api.put<MenuItem>(`/menu/${form._id}`, payload)
        );
        this.updateMenuItem(updated);
        this.categoryService.refreshCategories();
        return { success: true };
      }

      const created = await firstValueFrom(
        this.api.post<MenuItem>('/menu', payload)
      );
      this.state.update(current => ({
        ...current,
        menuItems: [created, ...current.menuItems]
      }));
      this.categoryService.refreshCategories();
      return { success: true };
    } catch (error) {
      console.error('Failed to save menu item', error);
      return { success: false, error: 'common.noData' };
    }
  }

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await firstValueFrom(this.api.delete(`/menu/${id}`));
      this.state.update(current => ({
        ...current,
        menuItems: current.menuItems.filter(item => item._id !== id)
      }));
      this.categoryService.refreshCategories();
    } catch (error) {
      console.error('Failed to delete menu item', error);
    }
  }

  private async loadMenuItems(): Promise<void> {
    try {
      const items = await firstValueFrom(this.api.get<MenuItem[]>('/menu/admin/all'));
      this.state.update(current => ({
        ...current,
        menuItems: items
      }));
    } catch (error) {
      console.error('Failed to load menu items', error);
    }
  }

  private updateMenuItem(form: MenuItem): void {
    this.state.update(current => ({
      ...current,
      menuItems: current.menuItems.map(item => item._id === form._id ? form : item)
    }));
  }

  private normalizeForm(form: MenuForm): Omit<MenuItem, '_id' | 'createdAt' | '__v'> | null {
    const categoryArray = Array.isArray(form.category) && form.category.length ? form.category : ['其他'];

    const firstCategory = categoryArray[0] || '其他';
    const categoryOrder = this.resolveCategoryOrder(firstCategory);

    const customFields = (form.customFields || [])
      .filter(field => field.name && field.options?.length > 0)
      .map(field => ({
        ...field,
        options: field.options
          .filter(option => option.label)
          .map(option => ({ ...option, price: option.price ?? 0 }))
      }));

    if (!form.name || !form.price || form.price <= 0) return null;

    return {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      category: categoryArray,
      categoryOrder,
      image: form.image,
      customFields,
      available: form.available ?? true
    };
  }

  private resolveCategoryOrder(category: string): number {
    const map = new Map<string, number>();

    this.state().menuItems.forEach(item => {
      item.category.forEach(cat => {
        if (!map.has(cat) || item.categoryOrder < (map.get(cat) ?? Infinity)) {
          map.set(cat, item.categoryOrder);
        }
      });
    });

    if (map.has(category)) return map.get(category) ?? 999;
    if (!map.size) return 0;
    return Math.max(...Array.from(map.values())) + 1;
  }

  private getSortedMenuItems(): MenuItem[] {
    return [...this.state().menuItems].sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
      return a.name.localeCompare(b.name);
    });
  }

  private getSortedCategories(): string[] {
    const categoryOrder = new Map<string, number>();
    const categories = new Set<string>();

    this.state().menuItems.forEach(item => {
      item.category.forEach(cat => {
        categories.add(cat);
        const existingOrder = categoryOrder.get(cat);
        if (existingOrder === undefined || item.categoryOrder < existingOrder) {
          categoryOrder.set(cat, item.categoryOrder);
        }
      });
    });

    return Array.from(categories).sort((a, b) => {
      const orderA = categoryOrder.get(a) ?? 999;
      const orderB = categoryOrder.get(b) ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });
  }
}
