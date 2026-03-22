export const SpecialCategory = {
  ALL: 'features.menuManagement.categories.all',
  OTHER: 'features.menuManagement.categories.other',
} as const;

export type SpecialCategoryType = typeof SpecialCategory[keyof typeof SpecialCategory];

export function isSpecialCategory(value: unknown): value is SpecialCategoryType {
  return Object.values(SpecialCategory).includes(value as SpecialCategoryType);
}

export const MENU_DEFAULTS = {
  DEFAULT_CATEGORY: SpecialCategory.OTHER,
  DEFAULT_CATEGORY_ORDER: 999,
  DEFAULT_AVAILABILITY: true,
} as const;

export const MENU_CONSTRAINTS = {
  MAX_CATEGORIES_PER_ITEM: 10,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999.99,
} as const;

export const STORE_INFO_CONSTRAINTS = {
  MAX_LABEL_LENGTH: 100,
  MAX_VALUE_LENGTH: 500,
  RESERVED_FIELDS: ['storeName'] as const,
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  CHECKOUT: 'checkout',
} as const;

export type TableStatusType = typeof TABLE_STATUS[keyof typeof TABLE_STATUS];

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  SUPERADMIN: 'superadmin',
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

export const API_RESPONSE = {
  SUCCESS_CODE: 200,
  CREATED_CODE: 201,
  VALIDATION_ERROR_CODE: 400,
  NOT_FOUND_CODE: 404,
  SERVER_ERROR_CODE: 500,
} as const;

export const CACHE_KEYS = {
  MENU_ITEMS: 'menu:items:all',
  MENU_CATEGORIES: 'menu:categories',
  MENU_ITEM_PREFIX: 'menu:item:',
  STORE_INFO: 'store:info:all',
  STORE_NAME: 'store:name',
} as const;

export const SOCKET_EVENTS = {
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  MENU_CHANGED: 'menu:changed',
  TABLE_UPDATED: 'table:updated',
} as const;
