import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss'],
})
export class LanguageToggleComponent {
  protected lang = inject(LanguageService);
  protected hover = false;

  get labelKey() {
    return this.lang.current === 'zh' ? 'language.current.en' : 'language.current.zh';
  }
}
