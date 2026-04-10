import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
  message = input.required<string>();
  paddingY = input<string>('py-20');
  iconColor = input<string>('text-primary-600');
  iconSize = input<string>('text-4xl');
  iconWithWrapper = input<boolean>(false);
  subMessage = input<string>('');
}
