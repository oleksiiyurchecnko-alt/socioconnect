export interface DashboardUserSnapshot {
  id: string;
  name: string;
}

export interface DashboardStatsSnapshot {
  appName: string;
  mockDelayMs: number;
  sum: number;
  user: DashboardUserSnapshot;
}
