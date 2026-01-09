import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-order-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './order-layout.component.html',
  styleUrls: ['./order-layout.component.scss'],
})
export class OrderLayoutComponent {}
