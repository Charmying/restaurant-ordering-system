import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryManagementService } from './category-management.service';
import { CategoryManagementPresenter } from './category-management.presenter';
import { getCategoryI18nKey, isCategoryTranslatable as isSpecialCategoryTranslatable } from '../../shared/utils/category-i18n.util';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagementComponent {
  private readonly categoryService = inject(CategoryManagementService);

  /* ========================= State ========================= */

  readonly categories = this.categoryService.categories;
  readonly totalCount = this.categoryService.totalCount;

  readonly draggedCategoryIndex = signal<number | null>(null);
  readonly dragOverIndex = signal<number | null>(null);

  /* ========================= Actions ========================= */

  onCategoryDragStart(event: DragEvent, index: number): void {
    this.draggedCategoryIndex.set(index);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onCategoryDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex.set(index);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onCategoryDragLeave(): void {
    this.dragOverIndex.set(null);
  }

  onCategoryDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    if (this.draggedCategoryIndex() === null || this.draggedCategoryIndex() === dropIndex) {
      this.draggedCategoryIndex.set(null);
      this.dragOverIndex.set(null);
      return;
    }

    const next = CategoryManagementPresenter.reorder(
      this.categories(),
      this.draggedCategoryIndex()!,
      dropIndex
    );

    this.categoryService.setCategories(next);
    this.draggedCategoryIndex.set(null);
    this.dragOverIndex.set(null);
  }

  onCategoryDragEnd(): void {
    this.draggedCategoryIndex.set(null);
    this.dragOverIndex.set(null);
  }

  getCategoryLabelKey(category: string): string {
    return getCategoryI18nKey(category);
  }

  isCategoryTranslatable(category: string): boolean {
    return isSpecialCategoryTranslatable(category);
  }
}
