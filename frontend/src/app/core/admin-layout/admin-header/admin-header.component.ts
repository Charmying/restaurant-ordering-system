import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageToggleComponent } from '../../components/language-toggle/language-toggle.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { ServiceCallNotificationComponent } from './service-call-notification/service-call-notification.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [TranslateModule, LanguageToggleComponent, ThemeToggleComponent, ServiceCallNotificationComponent],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent {}
