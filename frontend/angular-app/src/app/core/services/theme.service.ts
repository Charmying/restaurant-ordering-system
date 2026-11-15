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
    this.#writeStorage(theme);
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
    const saved = this.#readStorage();
    if (saved === 'light' || saved === 'dark') return saved;

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  #readStorage(): string | null {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  #writeStorage(theme: Theme): void {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // Ignore storage failures to keep theme toggling functional.
    }
  }
}
