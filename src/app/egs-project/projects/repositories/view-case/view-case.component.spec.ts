import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaseComponent } from './view-case.component';

describe('ViewCaseComponent', () => {
  let component: ViewCaseComponent;
  let fixture: ComponentFixture<ViewCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
