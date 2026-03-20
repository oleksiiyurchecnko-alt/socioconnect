import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@socioconnect/ui-components';
import type { User } from '@socioconnect/types';
import { addNumbers } from '@socioconnect/utils';
import { APP_NAME, MOCK_API_DELAY_MS } from '@socioconnect/constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  title = 'Main';
  appName = APP_NAME;
  mockDelay = MOCK_API_DELAY_MS;
  sum = addNumbers(10, 5);
  user: User = { id: '2', name: 'Main User' };

  onAction(): void {
    this.sum = addNumbers(this.sum, 1);
  }
}
