import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { reloadPage } from '../services/global-functions.service';

@Component({
  selector: 'app-egs-testing-component-karl',
  templateUrl: './egs-testing-component-karl.component.html',
  styleUrls: ['./egs-testing-component-karl.component.css']
})
export class EgsTestingComponentKarlComponent implements OnInit {
  displayImage: any;


  constructor(private api: ApiService) {

    //? Stored Procedure Name
    var commandText = 'egsQATestCaseAttachmentGet';

    //? Parameter of the store procedure
    var Params =
      [
        {
          Param: "@CaseAttachment_ID",
          Value: ""
        }
      ];

    //? Convert Param JSON to String So may the api able to read json
    var stringParam = JSON.stringify(Params);

    //? When we are using UniAttachment we need to use Formdata in angular allowing us
    //? to create, read, update and delete files
    //? When Getting file Params and CommandText is the only requirement
    var formData = new FormData();
    formData.append("CommandText", commandText);
    formData.append("Params", stringParam);

    //? API CALL
    this.api.UniAttachmentlist(formData).subscribe({
      next: (result) => {
        this.displayImage = result[0];
        console.log(result)
      },
      error: (msg) => {
        console.log(msg);
        alert("500 Internal Server Errors")
      }
    })
  }

  //? Function for downloading file
  downloadFile(file_ID: any, filename: string) {

    //? Stored Procedure Name
    var commandText = 'egsQATestCaseAttachmentGet';

    //? Parameter of the store procedure
    var Params = [{
      Param: "@CaseAttachment_ID",
      Value: file_ID.toString()
    }]

    //? Convert Param JSON to String So may the api able to read json
    var stringParam = JSON.stringify(Params);
    var formData = new FormData();


    //? When we are using UniAttachment we need to use Formdata in angular allowing us
    //? to create, read, update and delete files
    //? When posting file the "isDownload field is required"
    formData.append("CommandText", commandText);
    formData.append("Params", stringParam);
    formData.append("file_ID", file_ID.toString());
    formData.append("isDownload", 'true');

    this.api.UniAttachmentlist(formData, true).subscribe({
      next: (result) => {
        let blob: Blob = result.body as Blob;
        let a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      error: (msg) => {
        console.log(msg);
      }
    })

  }

  //? Posting File to API
  createFile(event: any) {
    console.log(event.target.files[0])
    //? Stored Procedure Name
    var commandText = 'egsQATestCaseAttachmentInsertUpdate';

    //? Parameter of the store procedure
    var Params =
      [
        {
          "Param": "@Case_ID",
          "Value": "90"
        },
        {
          "Param": "@User_ID",
          "Value": "3"
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

    this.api.UniAttachmentlist(formData, true).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (msg) => {
        console.log(msg);
      },
      complete: ()=>{
        reloadPage();
      }
    })

  }
  //? Deleting File to API
  deleteFile(event: Event) {

    var file_ID = (event.target as HTMLInputElement).value;
    console.log(file_ID)
    //? Stored Procedure Name
    var commandText = 'egsQATestCaseAttachmentDelete';

    //? Parameter of the store procedure
    var Params = [{
      Param: "@CaseAttachment_ID",
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
      complete: ()=>{
        reloadPage();
      }
    })

  }
  ngOnInit(): void {
  }
}
