import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message-alert',
  imports: [],
  templateUrl: './error-message-alert.component.html',
  styleUrl: './error-message-alert.component.css',
})
export class ErrorMessageAlertComponent {
  textMessage = input<string>('');
}
