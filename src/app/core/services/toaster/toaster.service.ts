import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);

  success(message: string) {
    this.messageService.add({
      summary: 'FreshCart',
      severity: 'success',
      detail: this.translate(message),
      life: 2000,
    });
  }
  error(message: string) {
    this.messageService.add({
      summary: 'FreshCart',
      severity: 'error',
      detail: this.translate(message),
      life: 2000,
    });
  }
  warning(message: string) {
    this.messageService.add({
      summary: 'FreshCart',
      severity: 'warn',
      detail: this.translate(message),
      life: 2000,
    });
  }

  private translate(key: string): string {
    const result = this.translateService.instant(key);
    return result !== key ? result : key;
  }
}
