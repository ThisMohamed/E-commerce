import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriesComponent } from './sub-categories.component';

describe('SubCategoriesComponent', () => {
  let component: SubCategoriesComponent;
  let fixture: ComponentFixture<SubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoriesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
