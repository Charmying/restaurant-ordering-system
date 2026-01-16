import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageToggleComponent } from '../../components/language-toggle/language-toggle.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-order-header',
  standalone: true,
  imports: [TranslateModule, LanguageToggleComponent, ThemeToggleComponent],
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
})
export class OrderHeaderComponent {}
