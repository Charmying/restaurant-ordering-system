import { LocalizedString } from '../types/i18n.types';

export function getMenuItemNameById(menuItemId: string, menuItems: any[], lang: string): string {
  const item = menuItems.find(m => m._id === menuItemId);
  if (!item) return '';

  if (typeof item.name === 'string') return item.name;

  const localizedName = item.name as LocalizedString;
  return localizedName[lang as keyof LocalizedString] || localizedName.zh || localizedName.en || '';
}

export function getCustomizationDisplay(customization: Record<string, any> | undefined, menuItemId: string, menuItems: any[], lang: string): string[] {
  if (!customization) return [];

  const item = menuItems.find(m => m._id === menuItemId);
  if (!item || !item.customFields) return [];

  const result: string[] = [];

  Object.entries(customization).forEach(([key, value]) => {
    if (key === 'note') return;

    let fieldId: any;
    try {
      fieldId = JSON.parse(key);
    } catch {
      fieldId = key;
    }

    const field = item.customFields.find((f: any) => {
      if (typeof f.name === 'string') return f.name === fieldId || f.name === key;
      return JSON.stringify(f.name) === JSON.stringify(fieldId);
    });

    if (!field) return;

    const fieldName = typeof field.name === 'string' ? field.name : (field.name[lang] || field.name.zh || field.name.en);

    const options = Array.isArray(value) ? value : [value];
    const optionLabels = options.map((opt: string) => {
      let optionId: any;
      try {
        optionId = JSON.parse(opt);
      } catch {
        optionId = opt;
      }

      const option = field.options.find((o: any) => {
        if (typeof o.label === 'string') return o.label === optionId || o.label === opt;
        return JSON.stringify(o.label) === JSON.stringify(optionId);
      });

      if (!option) return opt;

      return typeof option.label === 'string' ? option.label : (option.label[lang] || option.label.zh || option.label.en);
    });

    result.push(`${fieldName}: ${optionLabels.join(', ')}`);
  });

  return result;
}

export function calculateItemUnitPrice(orderItem: any, menuItems: any[]): number {
  const menuItem = menuItems.find(m => m._id === orderItem.menuItemId);
  if (!menuItem) return orderItem.price;

  let extraPrice = 0;

  if (orderItem.customization && menuItem.customFields) {
    Object.entries(orderItem.customization).forEach(([key, value]) => {
      if (key === 'note') return;

      let fieldId: any;
      try {
        fieldId = JSON.parse(key);
      } catch {
        fieldId = key;
      }

      const field = menuItem.customFields.find((f: any) => {
        if (typeof f.name === 'string') return f.name === fieldId || f.name === key;
        return JSON.stringify(f.name) === JSON.stringify(fieldId);
      });

      if (!field) return;

      const options = Array.isArray(value) ? value : [value];
      options.forEach((opt: string) => {
        let optionId: any;
        try {
          optionId = JSON.parse(opt);
        } catch {
          optionId = opt;
        }

        const option = field.options.find((o: any) => {
          if (typeof o.label === 'string') return o.label === optionId || o.label === opt;
          return JSON.stringify(o.label) === JSON.stringify(optionId);
        });

        if (option?.price) {
          extraPrice += option.price;
        }
      });
    });
  }

  return menuItem.price + extraPrice;
}
