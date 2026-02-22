export const SpecialCategory = {
  ALL: 'features.menuManagement.categories.all',
  OTHER: 'features.menuManagement.categories.other',
} as const;

export type SpecialCategoryType = typeof SpecialCategory[keyof typeof SpecialCategory];

export function isSpecialCategory(value: unknown): value is SpecialCategoryType {
  return Object.values(SpecialCategory).includes(value as SpecialCategoryType);
}

export function getCategoryLabelKey(category: string): string {
  if (isSpecialCategory(category)) return category;

  return category;
}

export function isOtherCategory(category: string): boolean {
  return category === SpecialCategory.OTHER;
}

export function isAllCategory(category: string): boolean {
  return category === SpecialCategory.ALL;
}
