import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCreateComponent } from './case-create.component';

describe('CaseCreateComponent', () => {
  let component: CaseCreateComponent;
  let fixture: ComponentFixture<CaseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
