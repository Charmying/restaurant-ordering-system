import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryManagementService } from './category-management.service';
import { CategoryManagementPresenter } from './category-management.presenter';
import { getCategoryI18nKey, isCategoryTranslatable as isSpecialCategoryTranslatable } from '../../shared/utils/category-i18n.util';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent {
  private readonly categoryService = inject(CategoryManagementService);

  /* ========================= State ========================= */

  readonly categories = this.categoryService.categories;
  readonly totalCount = this.categoryService.totalCount;

  draggedCategoryIndex: number | null = null;
  dragOverIndex: number | null = null;

  /* ========================= Actions ========================= */

  onCategoryDragStart(event: DragEvent, index: number): void {
    this.draggedCategoryIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onCategoryDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onCategoryDragLeave(): void {
    this.dragOverIndex = null;
  }

  onCategoryDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    if (this.draggedCategoryIndex === null || this.draggedCategoryIndex === dropIndex) {
      this.draggedCategoryIndex = null;
      this.dragOverIndex = null;
      return;
    }

    const next = CategoryManagementPresenter.reorder(
      this.categories(),
      this.draggedCategoryIndex,
      dropIndex
    );

    this.categoryService.setCategories(next);
    this.draggedCategoryIndex = null;
    this.dragOverIndex = null;
  }

  onCategoryDragEnd(): void {
    this.draggedCategoryIndex = null;
    this.dragOverIndex = null;
  }

  getCategoryLabelKey(category: string): string {
    return getCategoryI18nKey(category);
  }

  isCategoryTranslatable(category: string): boolean {
    return isSpecialCategoryTranslatable(category);
  }
}
