import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '@socioconnect/ui-components';

@Component({
  selector: 'app-dashboard-stats-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  templateUrl: './dashboard-stats-panel.component.html',
  styleUrl: './dashboard-stats-panel.component.scss',
})
export class DashboardStatsPanelComponent {
  heroTitle = input.required<string>();
  appName = input.required<string>();
  mockDelayMs = input.required<number>();
  userName = input.required<string>();
  userId = input.required<string>();
  sum = input.required<number>();
  incrementClick = output<void>();

  onIncrement(): void {
    this.incrementClick.emit();
  }
}
