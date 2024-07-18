import { ChangeDetectionStrategy, Component, HostBinding, Input, output } from '@angular/core';

export type Status = 'active' | 'paid' | 'cancelled';

export interface StatusChange {
  status: Status;
  id: number;
}

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCardComponent {
  @HostBinding('class')
  @Input()
  status: Status;

  @Input() table: number;

  @Input() id: number;

  readonly statusChange = output<StatusChange>();

  onActionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;

    switch (selectElement.value) {
      case 'pay':
        this.statusChange.emit({ id: this.id, status: 'paid' });
        break;
      case 'cancel':
        this.statusChange.emit({ id: this.id, status: 'cancelled' });
        break;
      case 'edit':
        break;
    }
  }
}
