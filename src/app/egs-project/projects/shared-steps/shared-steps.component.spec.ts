import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedStepsComponent } from './shared-steps.component';

describe('SharedStepsComponent', () => {
  let component: SharedStepsComponent;
  let fixture: ComponentFixture<SharedStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedStepsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
