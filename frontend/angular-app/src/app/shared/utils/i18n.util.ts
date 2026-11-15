import { LocalizedString, SupportedLanguage } from '../types/i18n.types';

export function getLocalizedValue(value: LocalizedString | string | undefined | null, lang: SupportedLanguage): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return (value[lang]?.trim() ? value[lang] : value.zh?.trim() ? value.zh : value.en?.trim() ? value.en : '').trim();
  return '';
}

export function createEmptyLocalizedString(): LocalizedString {
  return { zh: '', en: '' };
}

export function isLocalizedStringComplete(value: LocalizedString): boolean {
  return Boolean(value.zh.trim() && value.en.trim());
}
