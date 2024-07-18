import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from '../../../products/models';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent {
  @Input() table: number;

  @Input() products: Product[];
}
