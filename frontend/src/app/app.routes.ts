import { Routes } from '@angular/router';
import { NormalLayoutComponent } from './core/normal-layout/normal-layout.component';
import { HomeComponent } from './features/home/home.component';
import { OrderLayoutComponent } from './core/order-layout/order-layout.component';
import { OrderComponent } from './features/order/order.component';
import { LoginComponent } from './features/login/login.component';

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
      }
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
];
