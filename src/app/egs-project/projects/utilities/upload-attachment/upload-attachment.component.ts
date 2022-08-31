import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-attachment',
  templateUrl: './upload-attachment.component.html',
  styleUrls: ['./upload-attachment.component.css']
})
export class UploadAttachmentComponent implements OnInit {


  //Modal Variables
  @Input() Modal_Title: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
