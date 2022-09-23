import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePlanComponent } from './case-plan.component';

describe('CasePlanComponent', () => {
  let component: CasePlanComponent;
  let fixture: ComponentFixture<CasePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasePlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
