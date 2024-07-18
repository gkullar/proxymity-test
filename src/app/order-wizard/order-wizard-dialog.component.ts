import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, switchMap } from 'rxjs';

import { CategoryType } from '../categories/models';
import { OrderWizardService } from './order-wizard.service';
import {
  SelectItemsComponent,
  SelectItemsFormValue,
  SelectTableComponent,
  SelectTableFormValue,
  SummaryComponent
} from './ui';
import { Product } from '../products/models';

export interface OrderWizardDialogData {
  onSubmit: (params: { table: number; products: Product[] }) => void;
}

export enum OrderWizardStep {
  SelectTable = 1,
  SelectItems,
  Summary
}

@Component({
  selector: 'app-order-wizard-dialog',
  templateUrl: './order-wizard-dialog.component.html',
  imports: [
    AsyncPipe,
    NgIf,
    MatDialogModule,
    SelectItemsComponent,
    SelectTableComponent,
    SummaryComponent
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OrderWizardService]
})
export class OrderWizardDialogComponent {
  private readonly dialogRef: MatDialogRef<OrderWizardDialogComponent> = inject(MatDialogRef);

  private readonly data: OrderWizardDialogData = inject(MAT_DIALOG_DATA);

  readonly wizardService = inject(OrderWizardService);

  readonly getCategories$ = this.wizardService.fetchCategories();

  readonly getProducts$ = this.wizardService.selectedCategory.state$.pipe(
    switchMap((value) => this.wizardService.fetchProducts(value))
  );

  readonly step = OrderWizardStep;

  readonly currentStep$ = new BehaviorSubject<OrderWizardStep>(OrderWizardStep.SelectTable);

  onSelectTable(formValue: SelectTableFormValue) {
    this.wizardService.order.table.setState(formValue.tableNumber);
    this.currentStep$.next(OrderWizardStep.SelectItems);
  }

  onSelectCategory(categoryType: string) {
    this.wizardService.selectedCategory.setState(categoryType as CategoryType);
  }

  onSelectProducts(formValue: SelectItemsFormValue) {
    this.wizardService.order.products.setState(formValue.products);
    this.currentStep$.next(OrderWizardStep.Summary);
  }

  onConfirmOrder(table: number, products: Product[]) {
    this.data.onSubmit({ table, products });
    this.dialogRef.close();
  }
}
