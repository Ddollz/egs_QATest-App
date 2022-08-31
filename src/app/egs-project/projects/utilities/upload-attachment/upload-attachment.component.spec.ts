import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAttachmentComponent } from './upload-attachment.component';

describe('UploadAttachmentComponent', () => {
  let component: UploadAttachmentComponent;
  let fixture: ComponentFixture<UploadAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadAttachmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
