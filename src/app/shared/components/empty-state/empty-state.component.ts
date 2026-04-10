import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
})
export class EmptyStateComponent {
  iconClass = input<string>('');
  iconWrapperClass = input<string>('bg-gray-100 size-20 rounded-full');
  containerClass = input<string>('py-20');
  title = input<string>('');
  desc = input<string>('');
  titleClass = input<string>('text-lg');
  descClass = input<string>('text-base');
}
