import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgsRegistrationComponent } from './egs-registration.component';

describe('EgsRegistrationComponent', () => {
  let component: EgsRegistrationComponent;
  let fixture: ComponentFixture<EgsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgsRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
