import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectViewComponent } from './defect-view.component';

describe('DefectViewComponent', () => {
  let component: DefectViewComponent;
  let fixture: ComponentFixture<DefectViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefectViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
