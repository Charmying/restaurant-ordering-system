import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { StoreInfoService } from './store-info.service';
import { StoreInfoPresenter } from './store-info.presenter';
import { StoreInfoForm, StoreInfoItem } from './store-info.types';

@Component({
  selector: 'app-store-info',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss'],
})
export class StoreInfoComponent {
  private readonly storeInfoService = inject(StoreInfoService);
  private readonly translateService = inject(TranslateService);

  /* ========================= State ========================= */

  readonly storeInfoItems = this.storeInfoService.items;
  readonly totalCount = this.storeInfoService.totalCount;

  showAddInfoModal = false;
  showEditInfoModal = false;
  showDeleteInfoModal = false;
  showValidationModal = false;
  validationMessage = '';
  infoToDelete: StoreInfoItem | null = null;

  infoForm: StoreInfoForm = {
    _id: '',
    label: '',
    value: ''
  };

  /* ========================= Computed ========================= */

  readonly storeName = computed(() => StoreInfoPresenter.getStoreName(this.storeInfoItems()));

  /* ========================= Actions ========================= */

  openAddInfoModal(): void {
    this.infoForm = { _id: '', label: '', value: '' };
    this.showAddInfoModal = true;
  }

  editInfo(info: StoreInfoItem): void {
    this.infoForm = { _id: info._id, label: info.label, value: info.value };
    this.showEditInfoModal = true;
  }

  deleteInfo(info: StoreInfoItem): void {
    this.infoToDelete = info;
    this.showDeleteInfoModal = true;
  }

  confirmDelete(): void {
    if (this.infoToDelete) {
      this.storeInfoService.deleteInfo(this.infoToDelete._id);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteInfoModal = false;
    this.infoToDelete = null;
  }

  saveInfo(): void {
    if (!this.infoForm.label.trim()) {
      this.validationMessage = this.translateService.instant('features.storeInfo.validation.requiredLabel');
      this.showValidationModal = true;
      return;
    }

    if (this.showEditInfoModal) {
      this.storeInfoService.updateInfo(this.infoForm._id, this.infoForm.label, this.infoForm.value);
      this.showEditInfoModal = false;
      return;
    }

    this.storeInfoService.addInfo(this.infoForm.label, this.infoForm.value);
    this.showAddInfoModal = false;
  }

  closeAddModal(): void {
    this.showAddInfoModal = false;
  }

  closeEditModal(): void {
    this.showEditInfoModal = false;
  }

  closeValidationModal(): void {
    this.showValidationModal = false;
  }
}
