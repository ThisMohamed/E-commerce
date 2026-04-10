import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersSectionComponent } from './banners-section.component';

describe('BannersSectionComponent', () => {
  let component: BannersSectionComponent;
  let fixture: ComponentFixture<BannersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannersSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BannersSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
