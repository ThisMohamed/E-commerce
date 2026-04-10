import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-newsletter-section',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './newsletter-section.component.html',
  styleUrl: './newsletter-section.component.css',
})
export class NewsletterSectionComponent {}
