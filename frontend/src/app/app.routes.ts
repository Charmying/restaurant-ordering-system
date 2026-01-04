import { Routes } from '@angular/router';
import { NormalLayoutComponent } from './core/normal-layout/normal-layout.component';
import { HomeComponent } from './features/home/home.component';

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
  }
];
