import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs';

import { Category } from '../../../categories/models';
import { Product } from '../../../products/models';

export interface SelectItemsFormValue {
  categoryType: string;
  products: Product[];
}

@Component({
  selector: 'app-select-items',
  standalone: true,
  imports: [AsyncPipe, NgFor, ReactiveFormsModule],
  templateUrl: './select-items.component.html',
  styleUrl: './select-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectItemsComponent {
  @Input() categories: Category[];

  @Input() products: Product[];

  readonly selectCategory = output<string>();

  readonly formSubmit = output<SelectItemsFormValue>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    categoryType: this.fb.nonNullable.control('', [Validators.required]),
    productIds: this.fb.nonNullable.control<string[]>([], [Validators.required])
  });

  readonly categoryValueChanges$ = this.form.valueChanges.pipe(
    filter(() => !!this.form.value.categoryType),
    tap(() => this.selectCategory.emit(this.form.value.categoryType!))
  );

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit({
        categoryType: this.form.getRawValue().categoryType,
        products: this.products.filter((product) =>
          this.form.getRawValue().productIds.includes(product.idMeal)
        )
      });
    }
  }
}
