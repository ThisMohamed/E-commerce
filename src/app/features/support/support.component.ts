import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  imports: [PageHeaderComponent, TranslatePipe],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {}
