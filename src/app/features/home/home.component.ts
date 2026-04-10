import { Component } from '@angular/core';
import { SliderComponent } from './components/slider/slider.component';
import { CategoryHomeComponent } from './components/category-home/category-home.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { NewsletterSectionComponent } from './components/newsletter-section/newsletter-section.component';
import { BannersSectionComponent } from './components/banners-section/banners-section.component';
import { FeaturesBenfitsSectionComponent } from './components/features-benfits-section/features-benfits-section.component';

@Component({
  selector: 'app-home',
  imports: [
    SliderComponent,
    CategoryHomeComponent,
    FeaturedProductsComponent,
    NewsletterSectionComponent,
    BannersSectionComponent,
    FeaturesBenfitsSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
