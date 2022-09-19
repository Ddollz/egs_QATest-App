import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneCreateComponent } from './milestone-create.component';

describe('MilestoneCreateComponent', () => {
  let component: MilestoneCreateComponent;
  let fixture: ComponentFixture<MilestoneCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilestoneCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
