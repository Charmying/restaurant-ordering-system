import { Component } from '@angular/core';
import { useTheme } from '../composables/use-theme';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  protected theme = useTheme();
  protected hover = false;
}
