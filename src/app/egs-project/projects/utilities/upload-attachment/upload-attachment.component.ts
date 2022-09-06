import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-upload-attachment',
  templateUrl: './upload-attachment.component.html',
  styleUrls: ['./upload-attachment.component.css']
})
export class UploadAttachmentComponent implements OnInit {

  file: any;

  //Modal Variables
  @Input() Modal_Title: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getFile(event: any) {
    if (event.target == null) return
    this.file = event.target.files[0]
    console.log(this.file)
    this.uploadFile();
  }

  uploadFile() {
    let req = new XMLHttpRequest();
    let formData = new FormData()
    formData.set('file', this.file);

    req.open("POST", '../../../../../../upload/image');
    req.send(formData);

    // this.http.post('http://localhost:4200/upload/uploadfiles', formData).subscribe((Response) => { })

  }
}
