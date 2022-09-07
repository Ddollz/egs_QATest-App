import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgsTestingComponentKarlComponent } from './egs-testing-component-karl.component';

describe('EgsTestingComponentKarlComponent', () => {
  let component: EgsTestingComponentKarlComponent;
  let fixture: ComponentFixture<EgsTestingComponentKarlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgsTestingComponentKarlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgsTestingComponentKarlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
