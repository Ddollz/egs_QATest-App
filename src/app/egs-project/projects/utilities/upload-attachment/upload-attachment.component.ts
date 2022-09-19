import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { reloadPage } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-upload-attachment',
  templateUrl: './upload-attachment.component.html',
  styleUrls: ['./upload-attachment.component.css']
})
export class UploadAttachmentComponent implements OnInit {

  @ViewChild('Nav') panelNav?: ElementRef;
  @ViewChild('Content') panelContent?: ElementRef;
  file: any;
  @Output() fileUploaded: any;
  @Output() uploadedEvent = new EventEmitter<any>();

  //Modal Variables
  @Input() Modal_Title: string = '';
  @ViewChild('UploadModal') myDiv?: ElementRef;
  @ViewChild('myFileInput') myFileInput?: ElementRef;

  UserAttachments: any;

  temporaryUserId: number = 1;
  constructor(private http: HttpClient, private api: ApiService) {
    var Params =
      [
        {
          Param: "@User_ID",
          Value: this.temporaryUserId.toString()
        }

      ];
    var formData = new FormData();
    formData.append("CommandText", 'egsQAAttachmentGet');
    formData.append("Params", JSON.stringify(Params));

    //? API CALL
    this.api.UniAttachmentlist(formData).subscribe({
      next: (result) => {
        console.log(result);
        this.UserAttachments = result[0];
      },
      error: (msg) => {
        console.log(msg);
        alert("500 Internal Server Errors")
      }
    })
  }

  ngOnInit(): void {

  }

  changePanelContent(value: string, event?: Event) {
    let panelNavchildren = this.panelNav?.nativeElement.children;
    let activePanel = this.panelNav?.nativeElement.querySelector('#' + value);

    let panelContentchildren = this.panelContent?.nativeElement.children;
    let activeContent = this.panelContent?.nativeElement.querySelector('#' + value);

    for (let index = 0; index < panelNavchildren.length; index++) {

      panelNavchildren[index].classList.remove('active');

    }

    activePanel.classList.add('active');

    for (let index = 0; index < panelContentchildren.length; index++) {

      panelContentchildren[index].style.display = 'none';
    }

    activeContent.style.display = 'block';

  }


  uploadImage(event: any) {
    console.log(event.target.files[0])
    //? Stored Procedure Name
    var commandText = 'egsQAAttachmentInsertUpdate';

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

    if (this.myFileInput != undefined) {
      this.myFileInput.nativeElement.value = "";
    }
    this.api.UniAttachmentlist(formData).subscribe({
      next: (result) => {
        console.log(result[0]);
        this.fileUploaded = result[0];
        this.uploadedEvent.emit(result[0]);
      },
      error: (msg) => {
        console.log(msg);
      },
      complete: () => {
        this.myDiv?.nativeElement.click();

      }
    })

  }

  deleteAttachment(value: number) {

    var file_ID = value;
    //? Stored Procedure Name
    var commandText = 'egsQAAttachmentDelete';

    //? Parameter of the store procedure
    var Params = [{
      Param: "@Attachment_ID",
      Value: file_ID.toString()
    }]

    //? Convert Param JSON to String So may the api able to read json
    var stringParam = JSON.stringify(Params);
    var formData = new FormData();


    //? When we are using UniAttachment we need to use Formdata in angular allowing us
    //? to create, read, update and delete files
    //? When delete file the "isDelete field is required"
    formData.append("CommandText", commandText);
    formData.append("Params", stringParam);
    formData.append("file_ID", file_ID.toString());
    formData.append("isDelete", 'true');

    this.api.UniAttachmentlist(formData, false).subscribe({
      next: (result) => {
        console.log(result)
      },
      error: (msg) => {
        console.log(msg);
      },
      complete: () => {
        reloadPage();
      }
    })

  }
}
