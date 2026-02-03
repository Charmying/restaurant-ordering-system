import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FullScreenModalComponent } from '../../core/components/full-screen-modal/full-screen-modal.component';
import { MenuManagementService } from './menu-management.service';
import { MenuManagementPresenter } from './menu-management.presenter';
import { MenuCustomField, MenuCustomOption, MenuForm, MenuItem } from './menu-management.types';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, FullScreenModalComponent],
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss'],
})
export class MenuManagementComponent {
  private readonly menuService = inject(MenuManagementService);
  private readonly translateService = inject(TranslateService);

  /* ========================= State ========================= */

  readonly menuCategories = this.menuService.menuCategories;
  readonly selectedCategory = this.menuService.selectedCategory;
  readonly filteredMenuItems = this.menuService.filteredMenuItems;
  readonly allCategoryValue = this.menuService.allCategoryValue;

  showMenuModal = false;
  isEditMode = false;
  formError = '';

  menuForm: MenuForm = this.menuService.createEmptyForm();
  menuCategoryInput = '';
  newField: MenuCustomField = this.menuService.createEmptyCustomField();
  newOption: MenuCustomOption = { label: '', price: null };

  /* ========================= Computed ========================= */

  get categorySuggestions(): string[] {
    const input = (this.menuCategoryInput || '').trim().toLowerCase();
    const selected = new Set(this.menuForm.category || []);
    const categories = this.menuService.menuCategories().slice(1);

    return categories
      .filter(category => category && !selected.has(category))
      .filter(category => !input || category.toLowerCase().includes(input))
      .slice(0, 8);
  }

  get isFormValid(): boolean {
    return Boolean(this.menuForm.name?.trim()) && Number(this.menuForm.price) > 0;
  }

  /* ========================= UI Presenters ========================= */

  formatCurrency(amount: number): string {
    return MenuManagementPresenter.formatCurrency(amount);
  }

  isArray(value: any): boolean {
    return MenuManagementPresenter.isArray(value);
  }

  /* ========================= Actions ========================= */

  setSelectedCategory(category: string): void {
    this.menuService.setSelectedCategory(category);
  }

  openAddMenuModal(): void {
    this.menuForm = this.menuService.createEmptyForm();
    this.menuCategoryInput = '';
    this.newField = this.menuService.createEmptyCustomField();
    this.newOption = { label: '', price: null };
    this.formError = '';
    this.isEditMode = false;
    this.showMenuModal = true;
  }

  openEditMenuModal(item: MenuItem): void {
    this.menuForm = {
      ...item,
      category: Array.isArray(item.category) ? [...item.category] : ['其他'],
      customFields: JSON.parse(JSON.stringify(item.customFields || []))
    };
    this.menuCategoryInput = '';
    this.newField = this.menuService.createEmptyCustomField();
    this.newOption = { label: '', price: null };
    this.formError = '';
    this.isEditMode = true;
    this.showMenuModal = true;
  }

  closeMenuModal(): void {
    this.showMenuModal = false;
    this.formError = '';
  }

  saveMenuItem(): void {
    const result = this.menuService.saveMenuItem(this.menuForm, this.isEditMode);
    if (!result.success) {
      this.formError = result.error ? this.translateService.instant(result.error) : this.translateService.instant('common.noData');
      return;
    }
    this.showMenuModal = false;
  }

  deleteMenuItem(item: MenuItem): void {
    const message = this.translateService.instant('features.menuManagement.actions.deleteConfirm');
    if (!window.confirm(message)) return;
    this.menuService.deleteMenuItem(item._id);
  }

  addCustomField(): void {
    if (!this.newField.name.trim() || this.newField.options.length === 0) return;

    this.menuForm.customFields.push(JSON.parse(JSON.stringify(this.newField)));
    this.newField = this.menuService.createEmptyCustomField();
  }

  removeCustomField(index: number): void {
    this.menuForm.customFields.splice(index, 1);
  }

  addOptionToNewField(): void {
    if (!this.newOption.label.trim()) return;
    this.newField.options.push({ label: this.newOption.label, price: this.newOption.price });
    this.newOption = { label: '', price: null };
  }

  removeOptionFromNewField(index: number): void {
    this.newField.options.splice(index, 1);
  }

  addOptionToField(field: MenuCustomField): void {
    if (!field.options) field.options = [];
    field.options.push({ label: '', price: null });
  }

  removeOptionFromField(field: MenuCustomField, index: number): void {
    field.options.splice(index, 1);
  }

  addCategoryFromInput(): void {
    const val = (this.menuCategoryInput || '').trim();
    if (!val) return;
    if (!this.menuForm.category) this.menuForm.category = [];
    if (!this.menuForm.category.includes(val)) {
      this.menuForm.category = this.menuForm.category.filter(cat => cat !== '其他');
      this.menuForm.category.push(val);
    }
    this.menuCategoryInput = '';
  }

  toggleCategorySuggestion(category: string): void {
    if (!this.menuForm.category) this.menuForm.category = [];
    if (this.menuForm.category.includes(category)) {
      this.menuForm.category = this.menuForm.category.filter(cat => cat !== category);
    } else {
      this.menuForm.category = this.menuForm.category.filter(cat => cat !== '其他');
      this.menuForm.category.push(category);
    }
    if (!this.menuForm.category.length) this.menuForm.category = ['其他'];
    this.menuCategoryInput = '';
  }

  removeCategory(category: string): void {
    if (!this.menuForm.category) return;
    this.menuForm.category = this.menuForm.category.filter(cat => cat !== category);
    if (!this.menuForm.category.length) this.menuForm.category = ['其他'];
  }

  triggerFileInput(): void {
    document.getElementById('imageUpload')?.click();
  }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

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
        ctx?.drawImage(img, 0, 0, width, height);

        this.menuForm.image = canvas.toDataURL('image/webp', 0.85);
      };
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}
