import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-banners-section',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './banners-section.component.html',
  styleUrl: './banners-section.component.css',
})
export class BannersSectionComponent {}
