import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { MyTranslateService } from '../../../../core/services/myTranslate/my-translate.service';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-slider',
  imports: [RouterLink, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements OnInit {
  private readonly myTranslate = inject(MyTranslateService);
  private readonly platformId = inject(PLATFORM_ID);
  direction = computed(() => this.myTranslate.direction());
  isBrowser = signal(false);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      register();
      this.isBrowser.set(true);
    }
  }
}
