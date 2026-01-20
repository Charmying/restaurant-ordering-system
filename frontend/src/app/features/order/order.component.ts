import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { MockMenu } from './order.mock';
import {
  MenuItem,
  CustomizationState,
  CustomField,
  CustomOption,
} from './order.types';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  /* ========================= State ========================= */
  selectedCategory = signal<string>('全部');
  selectedItem = signal<MenuItem | null>(null);
  showCustomizeModal = signal(false);

  customization = signal<CustomizationState>({
    selections: {},
    note: '',
  });

  /* ========================= Data ========================= */
  menuItems = signal<MenuItem[]>(MockMenu);

  /* ========================= Computed ========================= */
  categories = computed(() => {
    const set = new Set<string>();

    this.menuItems().forEach(item => {
      const cats = Array.isArray(item.category)
        ? item.category
        : [item.category];

      cats.forEach(c => set.add(c));
    });

    return ['全部', ...Array.from(set)];
  });

  filteredMenuItems = computed(() => {
    if (this.selectedCategory() === '全部') {
      return this.menuItems();
    }

    return this.menuItems().filter(item =>
      Array.isArray(item.category)
        ? item.category.includes(this.selectedCategory())
        : item.category === this.selectedCategory()
    );
  });

  itemsByCategory = computed(() => {
    const map = new Map<string, MenuItem[]>();

    this.menuItems().forEach(item => {
      const cats = Array.isArray(item.category)
        ? item.category
        : [item.category];

      cats.forEach(cat => {
        if (!map.has(cat)) {
          map.set(cat, []);
        }
        map.get(cat)!.push(item);
      });
    });

    return map;
  });

  /* ========================= UI Helpers ========================= */
  getCategoryButtonClass(category: string): string {
    return category === this.selectedCategory()
      ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-contrast))]'
      : 'bg-[rgb(var(--surface-elevated))] text-[rgb(var(--text-primary))]';
  }

  getOptionButtonClass(
    field: CustomField,
    option: CustomOption
  ): string {
    const value = this.customization().selections[field.name];

    const selected =
      field.type === 'single'
        ? value === option.label
        : Array.isArray(value) && value.includes(option.label);

    return selected
      ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-contrast))]'
      : 'bg-[rgb(var(--surface-elevated))] text-[rgb(var(--text-primary))]';
  }

  /* ========================= Actions ========================= */
  openCustomizeModal(item: MenuItem) {
    this.selectedItem.set(item);
    this.customization.set({
      selections: {},
      note: '',
    });
    this.showCustomizeModal.set(true);
  }

  closeCustomizeModal() {
    this.showCustomizeModal.set(false);
  }

  onSelectOption(field: CustomField, option: CustomOption) {
    const state = structuredClone(this.customization());

    if (field.type === 'single') {
      state.selections[field.name] = option.label;
    } else {
      const current = (state.selections[field.name] as string[]) ?? [];
      state.selections[field.name] = current.includes(option.label)
        ? current.filter(v => v !== option.label)
        : [...current, option.label];
    }

    this.customization.set(state);
  }
}
