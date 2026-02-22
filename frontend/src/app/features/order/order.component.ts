import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { MenuItem, CustomizationState, CustomField, CustomOption } from './order.types';
import { CartService } from './cart.service';
import { OrderMenuService } from './order-menu.service';
import { StoreInfoService } from '../store-info/store-info.service';
import { LanguageService } from '../../core/services/language.service';
import { getLocalizedValue } from '../../shared/utils/i18n.util';
import { getCategoryI18nKey, isCategoryTranslatable } from '../../shared/utils/category-i18n.util';
import { SupportedLanguage, LocalizedString } from '../../shared/types/i18n.types';
import { SpecialCategory } from '../../shared/constants/category.constants';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  private readonly cartService = inject(CartService);
  private readonly orderMenuService = inject(OrderMenuService);
  private readonly storeInfoService = inject(StoreInfoService);
  private readonly languageService = inject(LanguageService);

  /* ========================= Public Constants ========================= */

  readonly SpecialCategory = SpecialCategory;

  /* ========================= View State ========================= */

  readonly selectedCategory = signal<string>(SpecialCategory.ALL);
  readonly selectedItem = signal<MenuItem | null>(null);
  readonly showCustomizeModal = signal(false);
  readonly quantity = signal(1);

  readonly customization = signal<CustomizationState>({
    selections: {},
    note: '',
  });

  /* ========================= Data ========================= */

  readonly menuItems = this.orderMenuService.menuItems;

  readonly storeInfoItems = computed(() =>
    this.storeInfoService.items().filter(item => !item.isStoreName)
  );

  /* ========================= Computed Derived State ========================= */

  readonly categories = computed(() => {
    const set = new Set<string>();

    this.menuItems().forEach(item => {
      const cats = Array.isArray(item.category) ? item.category : [item.category];
      cats.forEach(c => set.add(c));
    });

    return [SpecialCategory.ALL, ...Array.from(set)];
  });

  readonly filteredMenuItems = computed(() => {
    if (this.selectedCategory() === SpecialCategory.ALL) {
      return this.menuItems();
    }

    return this.menuItems().filter(item =>
      Array.isArray(item.category) ? item.category.includes(this.selectedCategory()) : item.category === this.selectedCategory()
    );
  });

  readonly itemsByCategory = computed(() => {
    const map = new Map<string, MenuItem[]>();

    this.menuItems().forEach(item => {
      const cats = Array.isArray(item.category) ? item.category : [item.category];

      cats.forEach(cat => {
        if (!map.has(cat)) {
          map.set(cat, []);
        }
        map.get(cat)!.push(item);
      });
    });

    return map;
  });

  /* ========================= Presentation ========================= */

  getLocalizedValue(value: LocalizedString | string | undefined): string {
    const lang = this.languageService.current as SupportedLanguage;
    return getLocalizedValue(value, lang);
  }

  getCategoryButtonClass(category: string): string {
    const isSelected = category === this.selectedCategory();
    return isSelected ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-contrast))]' : 'bg-surface-elevated text-primary';
  }

  getCategoryLabel(category: string): string {
    return getCategoryI18nKey(category);
  }

  isCategoryTranslatable(category: string): boolean {
    return isCategoryTranslatable(category);
  }

  getOptionButtonClass(field: CustomField, option: CustomOption): string {
    const fieldName = this.getLocalizedValue(field.name);
    const value = this.customization().selections[fieldName];
    const optionLabel = this.getLocalizedValue(option.label);
    const selected = field.type === 'single' ? value === optionLabel : Array.isArray(value) && value.includes(optionLabel);

    return selected ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-contrast))] shadow-md' : 'bg-surface-elevated text-primary';
  }

  /* ========================= Actions ========================= */

  openCustomizeModal(item: MenuItem): void {
    this.selectedItem.set(item);
    this.quantity.set(1);
    this.customization.set({
      selections: {},
      note: '',
    });
    this.showCustomizeModal.set(true);
  }

  closeCustomizeModal(): void {
    this.showCustomizeModal.set(false);
    this.quantity.set(1);
  }

  onSelectOption(field: CustomField, option: CustomOption): void {
    const state = structuredClone(this.customization());
    const fieldName = this.getLocalizedValue(field.name);
    const optionLabel = this.getLocalizedValue(option.label);

    if (field.type === 'single') {
      state.selections[fieldName] = optionLabel;
    } else {
      const current = (state.selections[fieldName] as string[]) ?? [];
      state.selections[fieldName] = current.includes(optionLabel) ? current.filter(v => v !== optionLabel) : [...current, optionLabel];
    }

    this.customization.set(state);
  }

  calculateCustomizationPrice(): number {
    const item = this.selectedItem();
    if (!item) return 0;

    let price = 0;
    const customizations = this.customization().selections;

    item.customFields?.forEach(field => {
      const fieldName = this.getLocalizedValue(field.name);
      const selected = customizations[fieldName];
      const options = field.type === 'single' ? [selected] : (Array.isArray(selected) ? selected : []);

      options.forEach(optionLabel => {
        const option = field.options.find(o => this.getLocalizedValue(o.label) === optionLabel);
        if (option?.price) {
          price += option.price;
        }
      });
    });

    return price;
  }

  calculateItemTotal(): number {
    const item = this.selectedItem();
    if (!item) return 0;

    const customizationPrice = this.calculateCustomizationPrice();
    const basePrice = item.price + customizationPrice;
    return basePrice * this.quantity();
  }

  addToCart(): void {
    const item = this.selectedItem();
    if (!item) return;

    const customizations = Object.entries(this.customization().selections)
      .filter(([_, value]) => value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true))
      .map(([fieldName, selectedOptions]) => {
        const field = item.customFields?.find(f => this.getLocalizedValue(f.name) === fieldName);
        const options = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
        
        return {
          fieldName,
          selectedOptions: options,
          fieldId: field ? JSON.stringify(field.name) : undefined,
          optionIds: field ? options.map(opt => {
            const option = field.options.find(o => this.getLocalizedValue(o.label) === opt);
            return option ? JSON.stringify(option.label) : opt;
          }) : undefined,
        };
      });

    const unitPrice = item.price + this.calculateCustomizationPrice();

    this.cartService.addItem(
      item._id,
      this.getLocalizedValue(item.name),
      item.price,
      customizations,
      this.customization().note,
      item.image,
      this.quantity(),
      unitPrice
    );

    this.closeCustomizeModal();
  }

  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }
}
