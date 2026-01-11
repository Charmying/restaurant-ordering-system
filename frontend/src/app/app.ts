import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services';
import { useTheme } from './core/composables/use-theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('restaurant-ordering-system');
  private lang = inject(LanguageService);

  constructor() {
    this.lang.init();
    useTheme();
  }
}
