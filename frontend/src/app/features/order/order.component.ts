import { Component, inject, signal, computed } from '@angular/core';
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
import { CartService } from './cart.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  private cartService = inject(CartService);

  /* ========================= State ========================= */
  selectedCategory = signal<string>('全部');
  selectedItem = signal<MenuItem | null>(null);
  showCustomizeModal = signal(false);
  quantity = signal(1);

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

  /* ========================= UI Presenters ========================= */
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
    this.quantity.set(1);
    this.customization.set({
      selections: {},
      note: '',
    });
    this.showCustomizeModal.set(true);
  }

  closeCustomizeModal() {
    this.showCustomizeModal.set(false);
    this.quantity.set(1);
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

  calculateCustomizationPrice(): number {
    const selectedItem = this.selectedItem();
    if (!selectedItem) return 0;

    let price = 0;
    const customizations = this.customization().selections;

    selectedItem.customFields?.forEach(field => {
      const selected = customizations[field.name];
      const options = field.type === 'single' ? [selected] : (Array.isArray(selected) ? selected : []);

      options.forEach(optionLabel => {
        const option = field.options.find(o => o.label === optionLabel);
        if (option?.price) {
          price += option.price;
        }
      });
    });

    return price;
  }

  calculateItemTotal(): number {
    const selectedItem = this.selectedItem();
    if (!selectedItem) return 0;

    const customizationPrice = this.calculateCustomizationPrice();
    const basePrice = selectedItem.price + customizationPrice;
    return basePrice * this.quantity();
  }

  addToCart(): void {
    const selectedItem = this.selectedItem();
    if (!selectedItem) return;

    const customizations = Object.entries(this.customization().selections)
      .filter(([_, value]) => value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true))
      .map(([fieldName, selectedOptions]) => ({
        fieldName,
        selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions],
      }));

    this.cartService.addItem(selectedItem._id, selectedItem.name, selectedItem.price, customizations, this.customization().note, selectedItem.image, this.quantity());

    this.closeCustomizeModal();
  }

  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }
}
