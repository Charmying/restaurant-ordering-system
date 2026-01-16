import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderHeaderComponent } from './order-header/order-header.component';

@Component({
  selector: 'app-order-layout',
  standalone: true,
  imports: [RouterOutlet, OrderHeaderComponent],
  templateUrl: './order-layout.component.html',
  styleUrls: ['./order-layout.component.scss'],
})
export class OrderLayoutComponent {}
