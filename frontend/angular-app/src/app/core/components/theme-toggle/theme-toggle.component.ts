import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { useTheme } from '../../composables/use-theme';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  protected theme = useTheme();
  protected hover = false;
}
