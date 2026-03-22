import { SpecialCategory, isSpecialCategory } from '../constants/category.constants';
import { i18nKeys } from '../constants/i18n.constants';

export function getCategoryI18nKey(category: string): string {
  if (category === SpecialCategory.ALL) return i18nKeys.features.menuManagement.categories.all;
  if (category === SpecialCategory.OTHER) return i18nKeys.features.menuManagement.categories.other;

  return category;
}

export function isCategoryTranslatable(category: string): boolean {
  return isSpecialCategory(category);
}

export function getTranslatableCategoryKeys(): Record<string, string> {
  return {
    [SpecialCategory.ALL]: i18nKeys.features.menuManagement.categories.all,
    [SpecialCategory.OTHER]: i18nKeys.features.menuManagement.categories.other,
  };
}
