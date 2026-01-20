import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavItems, NavItem } from './nav-config';


@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './dashboard.layout.html',
  styleUrls: ['./dashboard.layout.scss'],
})
export class DashboardLayout {
  readonly isSidebarOpen = signal(false);
  readonly navItems: NavItem[] = NavItems;

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
