import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  title = input.required<string>();
  description = input<string>('');
  iconClass = input<string>('fa-solid fa-layer-group');
  imageUrl = input<string>('');

  backgroundClass = input<string>(
    'bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 text-white',
  );

  breadcrumbs = input<{ label: string; link?: string }[]>([]);
}
