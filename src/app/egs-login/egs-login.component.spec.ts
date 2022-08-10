import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgsLoginComponent } from './egs-login.component';

describe('EgsLoginComponent', () => {
  let component: EgsLoginComponent;
  let fixture: ComponentFixture<EgsLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgsLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
