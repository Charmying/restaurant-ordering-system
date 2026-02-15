import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { OrderHeaderComponent } from './order-header/order-header.component';
import { OrderContextService } from '../../features/order/order-context.service';

@Component({
  selector: 'app-order-layout',
  standalone: true,
  imports: [RouterOutlet, OrderHeaderComponent],
  templateUrl: './order-layout.component.html',
  styleUrls: ['./order-layout.component.scss'],
})
export class OrderLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly orderContext = inject(OrderContextService);

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const table = params.get('table');
        const token = params.get('token');
        if (table || token) {
          this.orderContext.setFromQueryParams(table, token);
        }
      });
  }
}
