import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { LocalizedInputComponent } from '../../shared/components/localized-input/localized-input.component';
import { StoreInfoService } from './store-info.service';
import { StoreInfoPresenter } from './store-info.presenter';
import { StoreInfoForm, StoreInfoItem } from './store-info.types';
import { LanguageService } from '../../core/services/language.service';
import { SupportedLanguage, LocalizedString } from '../../shared/types/i18n.types';
import { createEmptyLocalizedString } from '../../shared/utils/i18n.util';
import { createI18nPlaceholder } from '../../shared/utils/placeholder.util';
import { STORE_INFO_FORM_PLACEHOLDERS } from '../../shared/constants/placeholder.constants';

@Component({
  selector: 'app-store-info',
  standalone: true,
  imports: [FormsModule, TranslateModule, ModalComponent, LocalizedInputComponent],
  templateUrl: './store-info.component.html',
  styleUrl: './store-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreInfoComponent {
  private readonly storeInfoService = inject(StoreInfoService);
  private readonly translateService = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  /* ========================= Public State ========================= */

  readonly storeInfoItems = this.storeInfoService.items;
  readonly totalCount = this.storeInfoService.totalCount;

  /* ========================= Dialog State ========================= */

  readonly showAddInfoModal = signal(false);
  readonly showEditInfoModal = signal(false);
  readonly showDeleteInfoModal = signal(false);
  readonly showValidationModal = signal(false);

  readonly validationMessage = signal('');
  readonly infoToDelete = signal<StoreInfoItem | null>(null);
  readonly isEditingStoreName = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);

  readonly infoForm = signal<StoreInfoForm>({
    _id: '',
    label: createEmptyLocalizedString(),
    value: createEmptyLocalizedString(),
  });

  /* ========================= Computed ========================= */

  readonly storeName = computed(() => {
    const lang = this.languageService.currentLang() as SupportedLanguage;
    return StoreInfoPresenter.getStoreName(this.storeInfoItems(), lang);
  });

  /* ========================= Presenters ========================= */

  getLocalizedValue(value: LocalizedString | string): string {
    const lang = this.languageService.current as SupportedLanguage;
    return StoreInfoPresenter.getLocalizedValue(value, lang);
  }

  labelPlaceholder(): LocalizedString {
    return createI18nPlaceholder(this.translateService, STORE_INFO_FORM_PLACEHOLDERS.infoLabel);
  }

  valuePlaceholder(): LocalizedString {
    return createI18nPlaceholder(this.translateService, STORE_INFO_FORM_PLACEHOLDERS.infoValue);
  }

  /* ========================= Dialog Actions ========================= */

  openAddInfoModal(): void {
    this.infoForm.set({
      _id: '',
      label: createEmptyLocalizedString(),
      value: createEmptyLocalizedString(),
    });
    this.showAddInfoModal.set(true);
  }

  editInfo(info: StoreInfoItem): void {
    this.infoForm.set({
      _id: info._id,
      label: info.label,
      value: info.value,
    });
    this.isEditingStoreName.set(info.isStoreName === true);
    this.showEditInfoModal.set(true);
  }

  deleteInfo(info: StoreInfoItem): void {
    this.infoToDelete.set(info);
    this.showDeleteInfoModal.set(true);
  }

  async confirmDelete(): Promise<void> {
    const item = this.infoToDelete();
    if (!item) return;

    this.isDeleting.set(true);
    try {
      await this.storeInfoService.deleteInfo(item._id);
      this.closeDeleteModal();
    } catch {
    } finally {
      this.isDeleting.set(false);
    }
  }

  closeDeleteModal(): void {
    this.showDeleteInfoModal.set(false);
    this.infoToDelete.set(null);
  }

  /* ========================= Form Actions ========================= */

  async saveInfo(): Promise<void> {
    const form = this.infoForm();

    if (!form.label?.zh?.trim()) {
      this.validationMessage.set(
        this.translateService.instant('features.storeInfo.validation.requiredLabel')
      );
      this.showValidationModal.set(true);
      return;
    }

    this.isSaving.set(true);
    try {
      if (this.showEditInfoModal()) {
        await this.storeInfoService.updateInfo(form._id, form.label, form.value);
        this.showEditInfoModal.set(false);
      } else {
        await this.storeInfoService.addInfo(form.label, form.value);
        this.showAddInfoModal.set(false);
      }
    } catch {
      this.validationMessage.set(this.translateService.instant('common.error'));
      this.showValidationModal.set(true);
    } finally {
      this.isSaving.set(false);
    }
  }

  closeAddModal(): void {
    this.showAddInfoModal.set(false);
  }

  closeEditModal(): void {
    this.showEditInfoModal.set(false);
    this.isEditingStoreName.set(false);
  }

  closeValidationModal(): void {
    this.showValidationModal.set(false);
  }
}
