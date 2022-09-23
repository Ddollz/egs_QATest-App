import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunCreateComponent } from './run-create.component';

describe('RunCreateComponent', () => {
  let component: RunCreateComponent;
  let fixture: ComponentFixture<RunCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
