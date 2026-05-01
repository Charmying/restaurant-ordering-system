import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'app_lang';
const DEFAULT_LANG = 'zh';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private readonly currentLangSignal = signal<string>(DEFAULT_LANG);

  readonly currentLang = computed(() => this.currentLangSignal());

  init() {
    const saved = this.readStorage();
    const lang = saved || DEFAULT_LANG;

    if (!saved) {
      this.writeStorage(lang);
    }

    this.translate.use(lang);
    this.currentLangSignal.set(lang);
  }

  switch() {
    const current = this.translate.currentLang;
    const next = current === 'zh' ? 'en' : 'zh';
    this.translate.use(next);
    this.writeStorage(next);
    this.currentLangSignal.set(next);
  }

  get current(): string {
    return this.currentLangSignal();
  }

  private readStorage(): string | null {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch {
      return null;
    }
  }

  private writeStorage(lang: string): void {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Ignore storage failures to keep i18n available in strict browser modes.
    }
  }
}
