import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected lang = inject(LanguageService);
  protected hoverLang = false;
}
