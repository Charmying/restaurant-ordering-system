import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavItems, NavItem } from './nav-config';
import { StoreInfoService } from '../store-info/store-info.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './dashboard.layout.html',
  styleUrls: ['./dashboard.layout.scss'],
})
export class DashboardLayout {
  private readonly storeInfoService = inject(StoreInfoService);
  readonly storeName = this.storeInfoService.storeName;
  readonly isSidebarOpen = signal(false);
  readonly navItems: NavItem[] = NavItems;

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
