import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiteChildComponent } from './suite-child.component';

describe('SuiteChildComponent', () => {
  let component: SuiteChildComponent;
  let fixture: ComponentFixture<SuiteChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiteChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiteChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
