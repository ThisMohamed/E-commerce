import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageAlertComponent } from './error-message-alert.component';

describe('ErrorMessageAlertComponent', () => {
  let component: ErrorMessageAlertComponent;
  let fixture: ComponentFixture<ErrorMessageAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageAlertComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
