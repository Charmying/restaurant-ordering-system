import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageToggleComponent } from '../../components/language-toggle/language-toggle.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { StoreInfoService } from '../../../features/store-info/store-info.service';

@Component({
  selector: 'app-normal-header',
  standalone: true,
  imports: [TranslateModule, LanguageToggleComponent, ThemeToggleComponent],
  templateUrl: './normal-header.component.html',
  styleUrls: ['./normal-header.component.scss'],
})
export class NormalHeaderComponent {
  private readonly storeInfoService = inject(StoreInfoService);
  readonly storeName = this.storeInfoService.storeName;
}
