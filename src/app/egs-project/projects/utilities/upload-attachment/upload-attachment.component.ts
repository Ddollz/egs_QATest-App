import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-upload-attachment',
  templateUrl: './upload-attachment.component.html',
  styleUrls: ['./upload-attachment.component.css']
})
export class UploadAttachmentComponent implements OnInit, AfterViewInit {

  file: any;
  @Output() fileUploaded: any;
  @Output() uploadedEvent = new EventEmitter<any>();

  //Modal Variables
  @Input() Modal_Title: string = '';
  @ViewChild('UploadModal') myDiv?: ElementRef;

  constructor(private http: HttpClient, private api: ApiService) {
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(this.myDiv);

  }


  uploadImage(event: any) {
    console.log(event.target.files[0])
    //? Stored Procedure Name
    var commandText = 'egsQATestCaseAttachmentInsertUpdate';

    //? Parameter of the store procedure
    var Params =
      [
        {
          "Param": "@User_ID",
          "Value": "1"
        }
      ]

    //? Convert Param JSON to String So may the api able to read json
    var stringParam = JSON.stringify(Params);
    var formData = new FormData();


    //? When we are using UniAttachment we need to use Formdata in angular allowing us
    //? to create, read, update and delete files
    //? When posting file the "files field is required"
    formData.append("CommandText", commandText);
    formData.append("Params", stringParam);
    formData.append("files", event.target.files[0]);

    this.api.UniAttachmentlist(formData).subscribe({
      next: (result) => {
        this.fileUploaded = result[1];
        this.uploadedEvent.emit(this.fileUploaded);
      },
      error: (msg) => {
        console.log(msg);
      },
      complete: ()=>{
        this.myDiv?.nativeElement.click();
      }
    })
  }
}
