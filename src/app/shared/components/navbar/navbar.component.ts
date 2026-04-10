import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { ReactiveFormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { MyTranslateService } from '../../../core/services/myTranslate/my-translate.service';
import { ThemeService } from '../../../core/services/theme/theme.service';
import { InsightsService } from '../../../core/services/insights/insights.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly wishlistService = inject(WishlistService);
  private readonly myTranslateService = inject(MyTranslateService);
  readonly themeService = inject(ThemeService);
  private readonly insightsService = inject(InsightsService);
  isLoggedIn = computed(() => this.authService.isLogged());
  LoggedInUser = computed(() => this.authService.loggedUser());
  numOfCartItems = computed(() => this.cartService.numOfCartItems());
  numOfWishlistItems = computed(() => this.wishlistService.numOfWishlistItems());
  currentLang = computed(() => this.myTranslateService.currentLang().toUpperCase());
  isOpenlangDropDown = signal<boolean>(false);
  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  profileMenu = signal(false);
  searchText = signal<string>('');
  isListening = signal(false);
  voiceSupported = signal(false);
  private SpeechRecognitionClass: any = null;
  private recognition: any = null;
  private routeSub?: Subscription;

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.getNumOfCartItems();
        this.getNumOfWishlistItems();
        this.authService.isLogged.set(true);
        this.authService.loggedUser.set(JSON.parse(localStorage.getItem('user')!));
      }
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.voiceSupported.set(true);
        this.SpeechRecognitionClass = SpeechRecognition;
      }
    }
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.routeSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.searchText.set('');
      });
  }

  private handleVoiceResult = (event: any) => {
    const transcript: string = event.results[0][0].transcript.trim().toLowerCase();
    this.isListening.set(false);
    this.isMenuOpen.set(false);

    const enNavMatch = transcript.match(/^go\s+to\s+(.+)$/);
    const arNavMatch = transcript.match(/^اذهب\s+(?:الي|إلى|الى)\s+(.+)$/);
    const navTarget = (enNavMatch?.[1] || arNavMatch?.[1] || '').trim();

    if (navTarget) {
      const navRoutes: { keywords: string[]; route: string[] }[] = [
        { keywords: ['home', 'main', 'start', 'الرئيسيه', 'الرئيسيه', 'الصفحة الرئيسيه'], route: ['/home'] },
        { keywords: ['shop', 'store', 'products', 'المتجر', 'المنتجات'], route: ['/shop'] },
        { keywords: ['cart', 'basket', 'السله', 'السلة', 'عربة التسوق'], route: ['/cart'] },
        { keywords: ['wishlist', 'favorites', 'المفضله', 'المفضله', 'قائمه الأمنيات'], route: ['/wishlist'] },
        { keywords: ['orders', 'my orders', 'طلباتي', 'الطلبات'], route: ['/allorders'] },
        { keywords: ['profile', 'account', 'ملفي', 'الحساب', 'حسابي'], route: ['/profile'] },
        { keywords: ['settings', 'setting', 'اعدادات', 'الاعدادات'], route: ['/profile/settings'] },
        { keywords: ['brands', 'brand', 'العلامات', 'الماركات'], route: ['/brands'] },
        { keywords: ['categories', 'category', 'الأقسام', 'الفئات', 'الاقسام'], route: ['/categories'] },
        { keywords: ['insights', 'statistics', 'stats', 'احصائيات', 'احصائياتي', 'الاحصائيات'], route: ['/insights'] },
        { keywords: ['contact', 'support', 'help', 'تواصل', 'الدعم', 'مساعده'], route: ['/contact'] },
      ];

      const matched = navRoutes.find((entry) =>
        entry.keywords.some((kw) => navTarget.includes(kw))
      );

      if (matched) {
        this.router.navigate(matched.route);
        return;
      }

      this.router.navigate(['/not-found']);
      return;
    }

    const hasArabic = /[\u0600-\u06FF]/.test(transcript);
    if (hasArabic) {
      this.startEnglishSearch();
      return;
    }

    this.searchText.set(transcript);
    this.insightsService.trackSearch(transcript);
    this.router.navigate(['/search'], { queryParams: { q: transcript } });
  };

  private startEnglishSearch(): void {
    if (!this.SpeechRecognitionClass) return;
    const r = new this.SpeechRecognitionClass();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript.trim().toLowerCase();
      this.isListening.set(false);
      this.searchText.set(transcript);
      this.insightsService.trackSearch(transcript);
      this.router.navigate(['/search'], { queryParams: { q: transcript } });
    };
    r.onerror = () => this.isListening.set(false);
    r.onend = () => this.isListening.set(false);
    this.recognition = r;
    this.isListening.set(true);
    r.start();
  }

  private setupRecognition(): void {
    if (!this.SpeechRecognitionClass) return;
    const lang = this.myTranslateService.currentLang();
    const r = new this.SpeechRecognitionClass();
    r.continuous = false;
    r.interimResults = false;
    r.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
    r.onresult = this.handleVoiceResult;
    r.onerror = () => this.isListening.set(false);
    r.onend = () => this.isListening.set(false);
    this.recognition = r;
  }

  getNumOfWishlistItems() {
    this.wishlistService.getLoggedUserWishList().subscribe({
      next: (res) => {
        this.wishlistService.numOfWishlistItems.set(res.count);
        this.wishlistService.wishlistProductIds.set(res.data.map((product: any) => product._id));
      },
    });
  }

  getNumOfCartItems() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
      },
    });
  }

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
    if (!this.isMenuOpen()) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update((v) => !v);
  }

  logOut() {
    this.authService.signOut();
  }

  toggleProfileMenu() {
    this.profileMenu.update((value) => !value);
  }

  closeProfileMenu() {
    this.profileMenu.set(false);
  }

  onSearch(event: SubmitEvent) {
    event.preventDefault();
    const query = this.searchText();
    if (!query.trim()) return;

    this.insightsService.trackSearch(query);
    this.router.navigate(['/search'], { queryParams: { q: query } });
    this.searchText.set('');
    this.isMenuOpen.set(false);
  }

  closeLangDropDown() {
    this.isOpenlangDropDown.set(false);
  }

  toggleLangDropDown() {
    this.isOpenlangDropDown.set(!this.isOpenlangDropDown());
  }

  changeLanguage(lang: string) {
    this.myTranslateService.changeLanguage(lang);
    this.closeLangDropDown();
  }

  startVoiceSearch() {
    if (!this.SpeechRecognitionClass || this.isListening()) return;
    this.setupRecognition();
    this.isListening.set(true);
    this.recognition.start();
  }

  stopVoiceSearch() {
    if (this.recognition && this.isListening()) {
      this.recognition.stop();
      this.isListening.set(false);
    }
  }

  ngOnDestroy(): void {
    this.stopVoiceSearch();
    this.routeSub?.unsubscribe();
  }
}
