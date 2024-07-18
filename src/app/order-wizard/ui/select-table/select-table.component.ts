import { NgFor } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface SelectTableFormValue {
  tableNumber: number;
}

@Component({
  selector: 'app-select-table',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './select-table.component.html',
  styleUrl: './select-table.component.scss',
})
export class SelectTableComponent {
  readonly formSubmit = output<SelectTableFormValue>();

  private readonly fb = inject(FormBuilder);

  readonly tableNumbers = Array.from({ length: 9 }, (_, index) => index + 1);

  readonly form = this.fb.group({
    tableNumber: this.fb.nonNullable.control(0, [Validators.required]),
  });

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit({
        tableNumber: this.form.getRawValue().tableNumber,
      });
    }
  }
}
