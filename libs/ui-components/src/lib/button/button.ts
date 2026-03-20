import { Component, input } from '@angular/core';

@Component({
  selector: 'sc-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonComponent {
  label = input<string>('Click');
  type = input<'button' | 'submit'>('button');
}
