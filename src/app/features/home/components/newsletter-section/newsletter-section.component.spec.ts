import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterSectionComponent } from './newsletter-section.component';

describe('NewsletterSectionComponent', () => {
  let component: NewsletterSectionComponent;
  let fixture: ComponentFixture<NewsletterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsletterSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
