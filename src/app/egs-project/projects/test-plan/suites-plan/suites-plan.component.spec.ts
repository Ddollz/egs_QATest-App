import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitesPlanComponent } from './suites-plan.component';

describe('SuitesPlanComponent', () => {
  let component: SuitesPlanComponent;
  let fixture: ComponentFixture<SuitesPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitesPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuitesPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
