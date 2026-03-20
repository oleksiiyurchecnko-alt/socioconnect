import { Injectable, computed, signal } from '@angular/core';
import { addNumbers } from '@socioconnect/utils';
import { APP_NAME, MOCK_API_DELAY_MS } from '@socioconnect/constants';
import type { DashboardStatsSnapshot } from '../types/dashboard.types';

@Injectable({ providedIn: 'root' })
export class DashboardSummaryService {
  readonly appName = APP_NAME;
  readonly mockDelayMs = MOCK_API_DELAY_MS;
  private readonly sum = signal(addNumbers(10, 5));
  private readonly user = signal<{ id: string; name: string }>({
    id: '2',
    name: 'Main User',
  });

  readonly snapshot = computed(
    (): DashboardStatsSnapshot => ({
      appName: this.appName,
      mockDelayMs: this.mockDelayMs,
      sum: this.sum(),
      user: this.user(),
    }),
  );

  increment(): void {
    this.sum.update((v) => addNumbers(v, 1));
  }
}
