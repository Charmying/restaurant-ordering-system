import { StoreInfoItem } from './store-info.types';
import { getLocalizedValue } from '../../shared/utils/i18n.util';
import { SupportedLanguage, LocalizedString } from '../../shared/types/i18n.types';

export class StoreInfoPresenter {
  static getStoreName(items: StoreInfoItem[], lang: SupportedLanguage = 'zh', translations?: Record<string, string>): string | null {
    const storeName = items.find(item => item.isStoreName);
    if (!storeName) {
      const storeNameLabelKey = 'features.storeInfo.storeNameLabel';
      const expectedLabel = translations?.[storeNameLabelKey] || (lang === 'zh' ? '店名' : 'Store Name');

      const fallback = items.find(item => {
        const label = getLocalizedValue(item.label, lang);
        return label === expectedLabel;
      });
      return fallback ? getLocalizedValue(fallback.value, lang) : null;
    }
    return getLocalizedValue(storeName.value, lang);
  }

  static getLocalizedValue(value: LocalizedString | string, lang: SupportedLanguage): string {
    return getLocalizedValue(value, lang);
  }
}
