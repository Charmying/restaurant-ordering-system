export const i18nKeys = {
  common: {
    cancel: 'common.cancel',
    delete: 'common.delete',
    ok: 'common.ok',
    noData: 'common.noData',
  },
  features: {
    order: {
      categories: {
        all: 'features.order.categories.all',
      },
    },
    menuManagement: {
      title: 'features.menuManagement.title',
      subtitle: 'features.menuManagement.subtitle',
      categories: {
        all: 'features.menuManagement.categories.all',
        other: 'features.menuManagement.categories.other',
      },
      actions: {
        add: 'features.menuManagement.actions.add',
        edit: 'features.menuManagement.actions.edit',
        delete: 'features.menuManagement.actions.delete',
      },
      fields: {
        name: 'features.menuManagement.fields.name',
        price: 'features.menuManagement.fields.price',
        description: 'features.menuManagement.fields.description',
        category: 'features.menuManagement.fields.category',
        image: 'features.menuManagement.fields.image',
      },
      placeholders: {
        name: 'features.menuManagement.placeholders.name',
        price: 'features.menuManagement.placeholders.price',
        description: 'features.menuManagement.placeholders.description',
        categoryInput: 'features.menuManagement.placeholders.categoryInput',
        optionName: 'features.menuManagement.placeholders.optionName',
        optionPrice: 'features.menuManagement.placeholders.optionPrice',
        fieldName: 'features.menuManagement.placeholders.fieldName',
      },
    },
    storeInfo: {
      storeNameLabel: 'features.storeInfo.storeNameLabel',
      form: {
        labelPlaceholder: 'features.storeInfo.form.labelPlaceholder',
        valuePlaceholder: 'features.storeInfo.form.valuePlaceholder',
      },
    },
  },
} as const;

export type I18nKey = typeof i18nKeys[keyof typeof i18nKeys];

export const MENU_MANAGEMENT_PLACEHOLDERS = {
  name: i18nKeys.features.menuManagement.placeholders.name,
  description: i18nKeys.features.menuManagement.placeholders.description,
  optionName: i18nKeys.features.menuManagement.placeholders.optionName,
  fieldName: i18nKeys.features.menuManagement.placeholders.fieldName,
} as const;

export const STORE_INFO_PLACEHOLDERS = {
  label: i18nKeys.features.storeInfo.form.labelPlaceholder,
  value: i18nKeys.features.storeInfo.form.valuePlaceholder,
} as const;
