export const MENU_MANAGEMENT_FORM_PLACEHOLDERS = {
  itemName: 'features.menuManagement.placeholders.name',
  price: 'features.menuManagement.placeholders.price',
  itemDescription: 'features.menuManagement.placeholders.description',
  categoryInput: 'features.menuManagement.placeholders.categoryInput',
  customOptionName: 'features.menuManagement.placeholders.optionName',
  customOptionPrice: 'features.menuManagement.placeholders.optionPrice',
  customFieldName: 'features.menuManagement.placeholders.fieldName',
} as const;

export const STORE_INFO_FORM_PLACEHOLDERS = {
  infoLabel: 'features.storeInfo.form.labelPlaceholder',
  infoValue: 'features.storeInfo.form.valuePlaceholder',
} as const;

export const USER_MANAGEMENT_FORM_PLACEHOLDERS = {
  username: 'features.userManagement.form.usernamePlaceholder',
  password: 'features.userManagement.form.passwordPlaceholder',
  currentPassword: 'features.userManagement.form.currentPasswordPlaceholder',
  newPassword: 'features.userManagement.form.newPasswordPlaceholder',
} as const;

export const MESSAGE_BOARD_FORM_PLACEHOLDERS = {
  newMessage: 'features.messageBoard.placeholders.new',
  editMessage: 'features.messageBoard.placeholders.edit',
} as const;

export const ORDER_FORM_PLACEHOLDERS = {
  remark: 'features.order.remarkPlaceholder',
} as const;

export const FORM_PLACEHOLDERS = {
  menuManagement: MENU_MANAGEMENT_FORM_PLACEHOLDERS,
  storeInfo: STORE_INFO_FORM_PLACEHOLDERS,
  userManagement: USER_MANAGEMENT_FORM_PLACEHOLDERS,
  messageBoard: MESSAGE_BOARD_FORM_PLACEHOLDERS,
  order: ORDER_FORM_PLACEHOLDERS,
} as const;

export type FormPlaceholderKey = string;
