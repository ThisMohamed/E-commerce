import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateCategory',
  standalone: true,
  pure: false,
})
export class TranslateCategoryPipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  transform(name: string | undefined): string {
    if (!name) return name ?? '';
    const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const key = `categoryNames.${normalized}`;
    const translated = this.translateService.instant(key);
    return translated === key ? name : translated;
  }
}
