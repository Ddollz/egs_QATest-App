import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgsWorkspaceComponent } from './egs-workspace.component';

describe('EgsWorkspaceComponent', () => {
  let component: EgsWorkspaceComponent;
  let fixture: ComponentFixture<EgsWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgsWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
