import { Injectable, effect, signal } from '@angular/core';

const KEY = 'app_theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.#load());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.body.setAttribute('data-theme', t);
      localStorage.setItem(KEY, t);
    });
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
