import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesBenfitsSectionComponent } from './features-benfits-section.component';

describe('FeaturesBenfitsSectionComponent', () => {
  let component: FeaturesBenfitsSectionComponent;
  let fixture: ComponentFixture<FeaturesBenfitsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesBenfitsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesBenfitsSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
