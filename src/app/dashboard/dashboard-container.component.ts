import { AsyncPipe, DecimalPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { tap, withLatestFrom } from 'rxjs';

import { OrderWizardDialogComponent, OrderWizardDialogData } from '../order-wizard';
import { Product } from '../products/models';
import { createState } from '../utils/state';
import { DashboardCardComponent, Status, StatusChange } from './ui';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { generateRandomId } from '../utils/random-id';

interface Order {
  id: number;
  table: number;
  products: Product[];
  status: Status;
}

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    DashboardCardComponent
  ],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DecimalPipe]
})
export class DashboardContainerComponent {
  private readonly dialog = inject(MatDialog);

  private readonly snackbar = inject(MatSnackBar);

  private readonly decimalPipe = inject(DecimalPipe);

  private readonly createOrder = createState<Order>();

  private readonly updateOrderStatus = createState<StatusChange>();

  readonly orders = createState<Order[]>([]);

  readonly createOrder$ = this.createOrder.state$.pipe(
    withLatestFrom(this.orders.state$),
    tap(([newOrder, currentOrders]) => this.orders.setState([...currentOrders, newOrder]))
  );

  readonly statusChange$ = this.updateOrderStatus.state$.pipe(
    withLatestFrom(this.orders.state$),
    tap(([statusChange, orders]) => {
      const updatedOrders = orders.map((order) =>
        order.id === statusChange.id ? { ...order, status: statusChange.status } : order
      );

      this.orders.setState(updatedOrders);

      if (statusChange.status === 'paid') {
        this.snackbar.open(`Order ${statusChange.id} paid`, 'close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 4000
        });
      }
    })
  );

  openDialog() {
    this.dialog.open<OrderWizardDialogComponent, OrderWizardDialogData>(
      OrderWizardDialogComponent,
      {
        minWidth: '350px',
        data: {
          onSubmit: ({ table, products }) =>
            this.createOrder.setState({ table, products, status: 'active', id: generateRandomId() })
        }
      }
    );
  }

  onStatusChange(statusChange: StatusChange) {
    this.updateOrderStatus.setState(statusChange);
  }

  getTooltipInfo(products: Product[]) {
    return products
      .map(
        (product) => `${product.strMeal}: $${this.decimalPipe.transform(product.price, '1.2-2')}`
      )
      .join(', ');
  }
}
