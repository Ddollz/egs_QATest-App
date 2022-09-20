import { Component, OnInit } from '@angular/core';
import { sharedStep, step } from '../../../../models/project/project.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { reloadPage } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-step-create',
  templateUrl: './step-create.component.html',
  styleUrls: ['./step-create.component.css']
})
export class StepCreateComponent implements OnInit {

  index: number = 0;
  Page_title: string = 'Create shared step';
  Button_title: string = 'Create';

  json: any = {};
  sharedSteps: any;
  steps: step[] = [];

  SharedStep_ID: number = 0;
  SharedStep_Title?: string;

  stepDeleteArray: string = '';


  listofAttachmentInStep: any = [];
  addingAttachmentTo?: number;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {

    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit shared step';
      this.Button_title = 'Save';
      this.SharedStep_ID = this.index;
      this.api.UniCall(
        {
          CommandText: 'egsQASharedStepGet',
          Params: [
            {
              Param: '@SharedStep_ID',
              Value: this.SharedStep_ID.toString()
            },
            {
              Param: '@WithSteps',
              Value: '1'
            }
          ]
        }
      ).subscribe({
        next: (e) => {
          this.SharedStep_ID = e[0][0].SharedStep_ID;
          this.SharedStep_Title = e[0][0].SharedStep_Title;
          if (!e[1]) return
          this.steps = e[1]
          let AttachnmentLists: any = [];
          for (let index = 0; index < this.steps.length; index++) {
            let tmp = this.steps[index].Attachments_ID;
            if (tmp == undefined || tmp == '') {
              continue;
            }
            else {
              AttachnmentLists = AttachnmentLists.concat(JSON.parse(tmp));
            }
          }
          var Params =
            [
              {
                Param: "@List",
                Value: JSON.stringify(AttachnmentLists)
              }

            ];


          var formData = new FormData();
          formData.append("CommandText", 'egsQAAttachmentGet');
          formData.append("Params", JSON.stringify(Params));

          //? API CALL
          this.api.UniAttachmentlist(formData).subscribe({
            next: (result) => {
              this.listofAttachmentInStep = result[0];
              console.log(this.listofAttachmentInStep)
            },
            error: (msg) => {
              console.log(msg);
              alert("500 Internal Server Errors")
            }
          })


        },
        error: (e) => {
          alert("500 Internal Server Errors")
        }
      });
    }

  }

  ngOnInit(): void {
  }

  addStep() {
    this.steps.push(
      {
        Case_StepID: 0,
        Step_number: this.steps.length + 1,
        Step_Type: "",
        Case_ID: 0,
        Step_Action: "",
        Step_InputData: "",
        Step_ExpectedResult: "",
        Step_Status: 0,
        SharedStep_ID: 0,
      }
    )
  }

  cloneStep(action: string, input: string, result: string) {
    this.steps.push(
      {
        Case_StepID: 0,
        Step_number: this.steps.length + 1,
        Step_Type: "",
        Case_ID: 0,
        Step_Action: action,
        Step_InputData: input,
        Step_ExpectedResult: result,
        Step_Status: 0,
        SharedStep_ID: 0,
        Attachments_ID: ''
      }
    )
  }

  deleteStep(value: step) {
    const index: number = this.steps.indexOf(value);
    if (index !== -1) {
      this.steps.splice(index, 1);
    }
    let i = 1;
    this.steps.forEach(element => {
      element.Step_number = i;
      i++
    });
    if (this.index != 0) {

      if (this.stepDeleteArray == "")
        this.stepDeleteArray = value.Case_StepID.toString();
      else
        this.stepDeleteArray = this.stepDeleteArray + ', ' + value.Case_StepID;

    }
  }

  updateInsertSharedStep(another: boolean = false) {
    console.log(JSON.stringify(this.steps))

    this.api.UniCall(
      {
        CommandText: 'egsQASharedStepInsertUpdate',
        Params: [
          {
            Param: '@SharedStep_ID',
            Value: this.SharedStep_ID.toString()
          },
          {
            Param: '@SharedStep_Title',
            Value: this.SharedStep_Title
          },
          {
            Param: '@stepJson',
            Value: JSON.stringify(this.steps)
          }
        ]
      }
    ).subscribe({
      next: (e) => {
        if (this.index != 0)
          this.api.UniCall(
            {
              CommandText: 'egsQAStepDelete',
              Params: [
                {
                  Param: '@Case_StepID',
                  Value: this.stepDeleteArray
                }
              ]
            }
          ).subscribe({
            next: (e) => {
            },
            error: (e) => {
              alert("500 Internal Server Errors")
              console.log(e)
            }
          });

      },
      error: (e) => {
        alert("500 Internal Server Errors")
      },
      complete: () => {
        if (another == true) {
          reloadPage()
        } else {
          this.router.navigate(["/projects/shared-steps"])
        }
      }
    });
  }


  stepClicked(step: step) {
    this.addingAttachmentTo = this.steps.indexOf(step);
    console.log(this.addingAttachmentTo)
  }
  addAttachment(event: any) {
    if (!this.listofAttachmentInStep.includes(event[0]))
      this.listofAttachmentInStep.push(event[0])
    if (this.addingAttachmentTo != undefined) {
      var stepAttachment = this.steps[this.addingAttachmentTo].Attachments_ID;
      console.log(this.steps[this.addingAttachmentTo])
      var stepAttachmentJson;
      if (stepAttachment == undefined || stepAttachment == '') {
        stepAttachmentJson = [];
      } else if (typeof stepAttachment == 'string') {
        stepAttachmentJson = JSON.parse(stepAttachment);
      }
      if (!stepAttachmentJson.includes(event[0].Attachment_ID))
        stepAttachmentJson.push(event[0].Attachment_ID)
      this.steps[this.addingAttachmentTo].Attachments_ID = JSON.stringify(stepAttachmentJson);
    }
  }

  //? Function for downloading file
  downloadFile(file_ID: any, filename: string) {

    //? Stored Procedure Name
    var commandText = 'egsQAAttachmentGet';

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
