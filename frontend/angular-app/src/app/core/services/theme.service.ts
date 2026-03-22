import { Injectable, effect, signal } from '@angular/core';

const KEY = 'app_theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.#load());

  constructor() {
    this.#applyTheme(this.theme());

    effect(() => {
      const t = this.theme();
      this.#applyTheme(t);
    });
  }

  #applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }

  toggle() {
    if (!document.startViewTransition) {
      this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
      return;
    }

    document.startViewTransition(() => {
      this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
    });
  }

  #load(): Theme {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;

    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
