import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardSummaryService } from '../../data-access/dashboard-summary.service';
import { DashboardStatsPanelComponent } from '../../ui/dashboard-stats-panel/dashboard-stats-panel.component';
import { dashboardHeroTitle } from '../../utils/dashboard-heading';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardStatsPanelComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent {
  private readonly summary = inject(DashboardSummaryService);
  protected readonly heroTitle = dashboardHeroTitle('Admin');
  protected readonly snapshot = this.summary.snapshot;

  onIncrement(): void {
    this.summary.increment();
  }
}
