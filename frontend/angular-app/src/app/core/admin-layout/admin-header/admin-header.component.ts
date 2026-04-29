import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageToggleComponent } from '../../components/language-toggle/language-toggle.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { ServiceCallNotificationComponent } from './service-call-notification/service-call-notification.component';
import { StoreInfoService } from '../../../features/store-info/store-info.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [TranslateModule, LanguageToggleComponent, ThemeToggleComponent, ServiceCallNotificationComponent],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent {
  private readonly storeInfoService = inject(StoreInfoService);
  readonly storeName = this.storeInfoService.storeName;
}
