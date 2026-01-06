import { Injectable, effect, signal } from '@angular/core';

const KEY = 'app_theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.#load());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.classList.toggle('dark', t === 'dark');
      localStorage.setItem(KEY, t);
    });
  }

  toggle() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  #load(): Theme {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;

    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
