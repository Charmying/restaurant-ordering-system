import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'app_lang';
const DEFAULT_LANG = 'zh';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);

  init() {
    const saved = localStorage.getItem(LANG_KEY);
    const lang = saved || DEFAULT_LANG;

    if (!saved) {
      localStorage.setItem(LANG_KEY, lang);
    }

    this.translate.use(lang);
  }

  switch() {
    const current = this.translate.currentLang;
    const next = current === 'zh' ? 'en' : 'zh';
    this.translate.use(next);
    localStorage.setItem(LANG_KEY, next);
  }

  get current(): string {
    return this.translate.currentLang || DEFAULT_LANG;
  }
}
