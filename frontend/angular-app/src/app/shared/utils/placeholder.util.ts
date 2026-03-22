import { TranslateService } from '@ngx-translate/core';
import { LocalizedString } from '../types/i18n.types';

export function createI18nPlaceholder(translateService: TranslateService, key: string): LocalizedString {
  return {
    zh: translateService.instant(key),
    en: translateService.instant(key),
  } as LocalizedString;
}

export function createI18nPlaceholderWithKeys(translateService: TranslateService, zhKey: string, enKey: string): LocalizedString {
  return {
    zh: translateService.instant(zhKey),
    en: translateService.instant(enKey),
  } as LocalizedString;
}
