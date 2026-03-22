import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FullScreenModalComponent } from '../../core/components/full-screen-modal/full-screen-modal.component';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { LocalizedInputComponent } from '../../shared/components/localized-input/localized-input.component';
import { MenuManagementService } from './menu-management.service';
import { MenuManagementPresenter } from './menu-management.presenter';
import { MenuCustomField, MenuCustomOption, MenuForm, MenuItem } from './menu-management.types';
import { LanguageService } from '../../core/services/language.service';
import { SupportedLanguage, LocalizedString } from '../../shared/types/i18n.types';
import { createEmptyLocalizedString } from '../../shared/utils/i18n.util';
import { createI18nPlaceholder } from '../../shared/utils/placeholder.util';
import { getCategoryI18nKey, isCategoryTranslatable } from '../../shared/utils/category-i18n.util';
import { SpecialCategory } from '../../shared/constants/category.constants';
import { MENU_MANAGEMENT_FORM_PLACEHOLDERS } from '../../shared/constants/placeholder.constants';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, FullScreenModalComponent, ModalComponent, LocalizedInputComponent],
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss'],
})
export class MenuManagementComponent {
  private readonly menuService = inject(MenuManagementService);
  private readonly translateService = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  /* ========================= Public State ========================= */

  readonly menuCategories = this.menuService.menuCategories;
  readonly selectedCategory = this.menuService.selectedCategory;
  readonly filteredMenuItems = this.menuService.filteredMenuItems;
  readonly allCategoryValue = this.menuService.allCategoryValue;

  /* ========================= Dialog State ========================= */

  readonly showMenuModal = signal(false);
  readonly isEditMode = signal(false);
  readonly formError = signal('');
  readonly menuForm = signal<MenuForm>(this.menuService.createEmptyForm());

  readonly showDeleteModal = signal(false);
  readonly itemToDelete = signal<MenuItem | null>(null);

  readonly newField = signal<MenuCustomField>(this.menuService.createEmptyCustomField());
  readonly newOption = signal<MenuCustomOption>({ label: createEmptyLocalizedString(), price: null });
  readonly menuCategoryInput = signal('');

  /* ========================= Computed Values ========================= */

  readonly categorySuggestions = computed(() => {
    const input = (this.menuCategoryInput() || '').trim().toLowerCase();
    const selected = new Set(this.menuForm().category || []);
    const categories = this.menuService.menuCategories().slice(1);

    return categories
      .filter(category => category && !selected.has(category))
      .filter(category => !input || category.toLowerCase().includes(input))
      .slice(0, 8);
  });

  readonly isFormValid = computed(() => {
    const form = this.menuForm();
    return Boolean(form.name?.zh?.trim() && form.name?.en?.trim()) && Number(form.price) > 0;
  });

  /* ========================= UI Presenters ========================= */

  formatCurrency(amount: number): string {
    return MenuManagementPresenter.formatCurrency(amount);
  }

  getLocalizedValue(value: LocalizedString | string): string {
    const lang = this.languageService.current as SupportedLanguage;
    return MenuManagementPresenter.getLocalizedValue(value, lang);
  }

  /* ========================= Localized Placeholder Utilities ========================= */

  getNamePlaceholder(): LocalizedString {
    return createI18nPlaceholder(this.translateService, MENU_MANAGEMENT_FORM_PLACEHOLDERS.itemName);
  }

  getDescriptionPlaceholder(): LocalizedString {
    return createI18nPlaceholder(this.translateService, MENU_MANAGEMENT_FORM_PLACEHOLDERS.itemDescription);
  }

  getOptionNamePlaceholder(): LocalizedString {
    return createI18nPlaceholder(this.translateService, MENU_MANAGEMENT_FORM_PLACEHOLDERS.customOptionName);
  }

  getFieldNamePlaceholder(): LocalizedString {
    return createI18nPlaceholder(this.translateService, MENU_MANAGEMENT_FORM_PLACEHOLDERS.customFieldName);
  }

  /* ========================= Category Actions ========================= */

  setSelectedCategory(category: string): void {
    this.menuService.setSelectedCategory(category);
  }

  getCategoryLabelKey(category: string): string {
    return getCategoryI18nKey(category);
  }

  isCategoryTranslatable(category: string): boolean {
    return isCategoryTranslatable(category);
  }

  /* ========================= Menu Modal Actions ========================= */

  openAddMenuModal(): void {
    this.menuForm.set(this.menuService.createEmptyForm());
    this.menuCategoryInput.set('');
    this.newField.set(this.menuService.createEmptyCustomField());
    this.newOption.set({ label: createEmptyLocalizedString(), price: null });
    this.formError.set('');
    this.isEditMode.set(false);
    this.showMenuModal.set(true);
  }

  openEditMenuModal(item: MenuItem): void {
    this.menuForm.set({
      ...item,
      category: Array.isArray(item.category) ? [...item.category] : [SpecialCategory.OTHER],
      customFields: JSON.parse(JSON.stringify(item.customFields || [])),
    });
    this.menuCategoryInput.set('');
    this.newField.set(this.menuService.createEmptyCustomField());
    this.newOption.set({ label: createEmptyLocalizedString(), price: null });
    this.formError.set('');
    this.isEditMode.set(true);
    this.showMenuModal.set(true);
  }

  closeMenuModal(): void {
    this.showMenuModal.set(false);
    this.formError.set('');
  }

  async saveMenuItem(): Promise<void> {
    const result = await this.menuService.saveMenuItem(this.menuForm(), this.isEditMode());
    if (!result.success) {
      const errorKey = result.error || 'common.noData';
      this.formError.set(this.translateService.instant(errorKey));
      return;
    }
    this.closeMenuModal();
  }

  /* ========================= Delete Modal Actions ========================= */

  deleteMenuItem(item: MenuItem): void {
    this.itemToDelete.set(item);
    this.showDeleteModal.set(true);
  }

  async confirmDelete(): Promise<void> {
    const item = this.itemToDelete();
    if (item) {
      await this.menuService.deleteMenuItem(item._id);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.itemToDelete.set(null);
  }

  /* ========================= Custom Field Actions ========================= */

  addCustomField(): void {
    const field = this.newField();
    if (!field.name?.zh?.trim() || !field.options || field.options.length === 0) {
      return;
    }

    const currentForm = this.menuForm();
    this.menuForm.set({
      ...currentForm,
      customFields: [...currentForm.customFields, JSON.parse(JSON.stringify(field))],
    });

    this.newField.set(this.menuService.createEmptyCustomField());
  }

  removeCustomField(index: number): void {
    const currentForm = this.menuForm();
    this.menuForm.set({
      ...currentForm,
      customFields: currentForm.customFields.filter((_, i) => i !== index),
    });
  }

  addOptionToNewField(): void {
    const option = this.newOption();
    if (!option.label?.zh?.trim()) return;

    const field = this.newField();
    this.newField.set({
      ...field,
      options: [...(field.options || []), { label: option.label, price: option.price }],
    });

    this.newOption.set({ label: createEmptyLocalizedString(), price: null });
  }

  removeOptionFromNewField(index: number): void {
    const field = this.newField();
    this.newField.set({
      ...field,
      options: field.options.filter((_, i) => i !== index),
    });
  }

  addOptionToField(fieldIndex: number): void {
    const currentForm = this.menuForm();
    const field = currentForm.customFields[fieldIndex];
    if (!field) return;

    const updatedFields = [...currentForm.customFields];
    updatedFields[fieldIndex] = {
      ...field,
      options: [...field.options, { label: createEmptyLocalizedString(), price: null }],
    };

    this.menuForm.set({ ...currentForm, customFields: updatedFields });
  }

  removeOptionFromField(fieldIndex: number, optionIndex: number): void {
    const currentForm = this.menuForm();
    const field = currentForm.customFields[fieldIndex];
    if (!field) return;

    const updatedFields = [...currentForm.customFields];
    updatedFields[fieldIndex] = {
      ...field,
      options: field.options.filter((_, i) => i !== optionIndex),
    };

    this.menuForm.set({ ...currentForm, customFields: updatedFields });
  }

  /* ========================= Category Input Actions ========================= */

  addCategoryFromInput(): void {
    const input = (this.menuCategoryInput() || '').trim();
    if (!input) return;

    const currentForm = this.menuForm();
    const categories = currentForm.category || [];

    if (!categories.includes(input)) {
      const updated = categories.filter(cat => !SpecialCategory.OTHER || cat !== SpecialCategory.OTHER);
      updated.push(input);
      this.menuForm.set({ ...currentForm, category: updated });
    }

    this.menuCategoryInput.set('');
  }

  toggleCategorySuggestion(category: string): void {
    const currentForm = this.menuForm();
    const categories = currentForm.category || [];

    let updatedCategories: string[];
    if (categories.includes(category)) {
      updatedCategories = categories.filter(cat => cat !== category);
      if (!updatedCategories.length) {
        updatedCategories = [SpecialCategory.OTHER];
      }
    } else {
      updatedCategories = [...categories.filter(cat => cat !== SpecialCategory.OTHER), category];
    }

    this.menuForm.set({ ...currentForm, category: updatedCategories });
    this.menuCategoryInput.set('');
  }

  removeCategory(category: string): void {
    const currentForm = this.menuForm();
    const cats = currentForm.category || [];
    const filtered = cats.filter(cat => cat !== category);

    this.menuForm.set({
      ...currentForm,
      category: filtered.length > 0 ? filtered : [SpecialCategory.OTHER],
    });
  }

  /* ========================= Image Upload ========================= */

  triggerFileInput(): void {
    document.getElementById('imageUpload')?.click();
  }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result !== 'string') return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxSize = 800;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const currentForm = this.menuForm();
        this.menuForm.set({ ...currentForm, image: canvas.toDataURL('image/webp', 0.85) });
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}
