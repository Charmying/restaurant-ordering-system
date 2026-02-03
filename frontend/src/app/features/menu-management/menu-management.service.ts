import { Injectable, signal, computed } from '@angular/core';
import { MenuCustomField, MenuItem, MenuManagementState, MenuForm } from './menu-management.types';
import { MockMenuItems } from './menu-management.mock';

const allCategory = '__all__';

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {
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
    this.loadMenuItems();
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

  saveMenuItem(form: MenuForm, isEdit: boolean): { success: boolean; error?: string } {
    if (!form.name || !form.price || form.price <= 0) {
      return { success: false, error: 'features.menuManagement.validation.required' };
    }

    const normalized = this.normalizeForm(form);
    if (!normalized) {
      return { success: false, error: 'features.menuManagement.validation.required' };
    }

    if (isEdit && normalized._id) {
      this.updateMenuItem(normalized);
      return { success: true };
    }

    const createdItem = {
      ...normalized,
      _id: normalized._id || this.generateId(),
      createdAt: normalized.createdAt || new Date().toISOString()
    };

    this.state.update(current => ({
      ...current,
      menuItems: [createdItem, ...current.menuItems]
    }));

    return { success: true };
  }

  deleteMenuItem(id: string): void {
    this.state.update(current => ({
      ...current,
      menuItems: current.menuItems.filter(item => item._id !== id)
    }));
  }

  private loadMenuItems(): void {
    this.state.update(current => ({
      ...current,
      menuItems: MockMenuItems
    }));
  }

  private updateMenuItem(form: MenuItem): void {
    this.state.update(current => ({
      ...current,
      menuItems: current.menuItems.map(item => item._id === form._id ? form : item)
    }));
  }

  private normalizeForm(form: MenuForm): MenuItem | null {
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
      _id: form._id || '',
      name: form.name,
      price: Number(form.price),
      description: form.description,
      category: categoryArray,
      categoryOrder,
      image: form.image,
      customFields,
      available: form.available ?? true,
      createdAt: form.createdAt || new Date().toISOString(),
      __v: form.__v ?? 0
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
