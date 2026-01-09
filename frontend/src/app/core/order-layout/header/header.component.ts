import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, ThemeService } from '../../services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected lang = inject(LanguageService);
  protected theme = inject(ThemeService);
  protected hoverLang = false;
  protected hoverTheme = false;
}
