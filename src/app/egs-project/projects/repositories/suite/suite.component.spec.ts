import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiteComponent } from './suite.component';

describe('SuiteComponent', () => {
  let component: SuiteComponent;
  let fixture: ComponentFixture<SuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
