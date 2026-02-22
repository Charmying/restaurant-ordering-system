export type SupportedLanguage = 'zh' | 'en';

export type LocalizedString = {
  [K in SupportedLanguage]: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['zh', 'en'];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  zh: '中文',
  en: 'English',
};
