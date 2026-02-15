import { Routes } from '@angular/router';
import { NormalLayoutComponent } from './core/normal-layout/normal-layout.component';
import { HomeComponent } from './features/home/home.component';
import { OrderLayoutComponent } from './core/order-layout/order-layout.component';
import { OrderComponent } from './features/order/order.component';
import { LoginComponent } from './features/login/login.component';
import { AdminLayoutComponent } from './core/admin-layout/admin-layout.component';
import { DashboardShell } from './features/dashboard/dashboard.shell';

export const routes: Routes = [
  {
    path: '',
    component: NormalLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'order',
    component: OrderLayoutComponent,
    children: [
      {
        path: '',
        component: OrderComponent
      },
      {
        path: 'checkout',
        loadComponent: () => import('./features/order/checkout/checkout.component').then((m) => m.CheckoutComponent),
      },
    ]
  },
  {
    path: 'login',
    component: NormalLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardShell,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'tables',
          },
          {
            path: 'tables',
            loadComponent: () => import('./features/table-management/table-management.component').then((m) => m.TableManagementComponent),
          },
          {
            path: 'orders',
            loadComponent: () => import('./features/order-management/order-management.component').then((m) => m.OrderManagementComponent),
          },
          
          {
            path: 'menu',
            loadComponent: () => import('./features/menu-management/menu-management.component').then((m) => m.MenuManagementComponent),
          },
          {
            path: 'categories',
            loadComponent: () => import('./features/category-management/category-management.component').then((m) => m.CategoryManagementComponent),
          },
          {
            path: 'store-info',
            loadComponent: () => import('./features/store-info/store-info.component').then((m) => m.StoreInfoComponent),
          },
          {
            path: 'messages',
            loadComponent: () => import('./features/message-board/message-board.component').then((m) => m.MessageBoardComponent),
          },
          {
            path: 'reports',
            loadComponent: () => import('./features/business-reports/business-reports.component').then((m) => m.BusinessReportsComponent),
          },
          {
            path: 'users',
            loadComponent: () => import('./features/user-management/user-management.component').then((m) => m.UserManagementComponent),
          },
        ]
      }
    ]
  },
];
