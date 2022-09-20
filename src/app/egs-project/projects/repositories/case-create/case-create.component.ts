import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { reloadPage } from '../../../../services/global-functions.service';
import { suite, step, testCase } from '../../../../models/project/project.model';
import { ActivatedRoute, Router } from '@angular/router';

import { sidebarService } from '../../../../services/global-functions.service';

@Component({
  selector: 'app-case-create',
  templateUrl: './case-create.component.html',
  styleUrls: ['./case-create.component.css']
})
export class CaseCreateComponent implements OnInit {

  //Utilities
  LinkParamID: number = 0;
  json: any = {};
  stepCount: number = 0;

  //createCase
  createCaseSuite: number = 0;

  //editCase
  editCase: number = 0;
  TestCaseAndStep: any;
  caseID: number = 0;
  deleteStepsFromEdit: string = '';

  //Models
  suites: suite[] = [];
  steps: step[] = [];
  testCase = {} as testCase;

  //Modal Variables
  Modal_Title: string = 'Upload Attachment';
  Modal_btn: string = 'Upload Attachment';

  //forms
  caseForm !: FormGroup;
  stepForm !: FormGroup;

  //Attachment Case
  attachments_id: Array<number> = [];
  attachments: any = [];
  uploadFrom: string = 'case';

  //Attachment CaseStep
  listofAttachmentInStepView: any = {};
  listofAttachmentInStep: any = [];
  addingAttachmentTo?: number;

  //SharedStep
  sharedStepsTitle: string = '';
  currentStep: step[] = [];
  sharedSteps: any;
  selectedSharedstep: any;
  @ViewChild('openCreateSharedModal') openSharedModalBtn?: ElementRef;

  //Step
  @ViewChild('openAddSharedStepModal') openSharedStepModalBTN?: ElementRef;


  constructor(private formBuilder: FormBuilder, private api: ApiService, private activatedRoute: ActivatedRoute, public sidebarServ: sidebarService, private router: Router) {
    this.LinkParamID = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.createCaseSuite = Number(this.activatedRoute.snapshot.queryParamMap.get('suite'));
    this.editCase = Number(this.activatedRoute.snapshot.queryParamMap.get('case'));

    this.sidebarServ.fetchProjectID(this.LinkParamID);
    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.LinkParamID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.suites = value[0];
      if (this.createCaseSuite == 0) {
        this.caseForm.controls['@Suite_ID'].setValue(this.suites[0].Suite_ID);
      } else {
        this.caseForm.controls['@Suite_ID'].setValue(this.createCaseSuite);
      }
    }
    );

    if (this.editCase != 0) {
      this.api.UniCall(
        {
          CommandText: 'egsQATestCaseGet',
          Params: [
            {
              Param: '@Case_ID',
              Value: this.editCase.toString()
            }
          ],
        }
      ).subscribe(value => {
        // this.steps = value[1];
        this.caseID = value[0][0].Case_ID;
        this.api.UniCall(
          {
            CommandText: 'egsQAStepGet',
            Params: [
              {
                Param: '@Case_ID',
                Value: this.caseID.toString()
              }
            ],
          }
        ).subscribe({
          next: (value) => {

            if (value[0]) {
              this.steps = value[0];
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
                },
                error: (msg) => {
                  console.log(msg);
                  alert("500 Internal Server Errors")
                }
              })

            }

          }
        })
        this.caseForm.controls['@Case_IDED'].setValue(value[0][0].Case_ID);
        this.caseForm.controls['@Case_Title'].setValue(value[0][0].Case_Title);
        this.caseForm.controls['@Case_Status'].setValue(value[0][0].Case_Status.toString());
        this.caseForm.controls['@Case_Desc'].setValue(value[0][0].Case_Desc);
        this.caseForm.controls['@Suite_ID'].setValue(value[0][0].Suite_ID);
        this.caseForm.controls['@Case_Severity'].setValue(value[0][0].Case_Severity.toString());
        this.caseForm.controls['@Case_Priority'].setValue(value[0][0].Case_Priority.toString());
        this.caseForm.controls['@Case_Type'].setValue(value[0][0].Case_Type);
        this.caseForm.controls['@Case_Layer'].setValue(value[0][0].Case_Layer.toString());
        this.caseForm.controls['@Case_Flaky'].setValue(value[0][0].Case_Flaky.toString());
        this.caseForm.controls['@Case_isLock'].setValue(value[0][0].Case_isLock.toString());
        this.caseForm.controls['@Case_Milestone'].setValue(value[0][0].Case_Milestone.toString());
        this.caseForm.controls['@Case_Behavior'].setValue(value[0][0].Case_Behavior.toString());
        this.caseForm.controls['@Case_AutoStat'].setValue(value[0][0].Case_AutoStat.toString());
        this.caseForm.controls['@Case_PreCondition'].setValue(value[0][0].Case_PreCondition);
        this.caseForm.controls['@Case_PostCondition'].setValue(value[0][0].Case_PostCondition);
        this.caseForm.controls['@Case_Tags'].setValue(value[0][0].Case_Tag);
        this.caseForm.controls['@User_ID'].setValue(value[0][0].User_ID);
        if (value[0][0].Attachments_ID != undefined && value[0][0].Attachments_ID != '') {
          var Params =
            [
              {
                Param: "@List",
                Value: value[0][0].Attachments_ID
              }

            ];
          this.attachments_id = JSON.parse(value[0][0].Attachments_ID);
          // console.log(this.attachments_id);
          var formData = new FormData();
          formData.append("CommandText", 'egsQAAttachmentGet');
          formData.append("Params", JSON.stringify(Params));

          //? API CALL
          this.api.UniAttachmentlist(formData).subscribe({
            next: (result) => {
              if (result[0] != undefined)
                this.attachments = result[0];
              // console.log(this.attachments);
            },
            error: (msg) => {
              console.log(msg);
              alert("500 Internal Server Errors")
            }
          })
        }

      }
      );
    }

    this.api.UniCall(
      {
        CommandText: 'egsQASharedStepGet',
        Params: [
          {
            Param: '@SharedStep_ID',
            Value: null
          }
        ]
      }
    ).subscribe(value => {
      this.sharedSteps = value[0];
    });
  }

  ngOnInit(): void {
    this.caseForm = this.formBuilder.group({
      '@Case_IDED': [null],
      '@Case_Title': [null],
      '@Case_Status': ['1'],
      '@Case_Desc': [null],
      '@Suite_ID': [''],
      '@Case_Severity': ['1'],
      '@Case_Priority': ['1'],
      '@Case_Type': ['Other'],
      '@Case_Layer': ['1'],
      '@Case_Flaky': ['1'],
      '@Case_isLock': ['1'],
      '@Case_Milestone': ['1'],
      '@Case_Behavior': ['1'],
      '@Case_AutoStat': ['1'],
      '@Case_PreCondition': [null],
      '@Case_PostCondition': [null],
      '@Case_Tags': ['1'],
      '@User_ID': ['1'],
    })

  }
  createCase() {
    this.json['CommandText'] = 'egsQATestCaseInsertUpdate';
    this.json['Params'] = [];

    for (const field in this.caseForm.controls) { // 'field' is a string
      var control = this.caseForm.get(field)?.value; // 'control' is a FormControl
      if (control != null)
        control = control.toString();
      var temp = {
        Param: field,
        Value: control
      }
      this.json['Params'].push(temp);
    }
    console.log(this.json);
    //? Param For attachment
    var attachmentParam = {
      Param: '@attachJson',
      Value: JSON.stringify(this.attachments_id)
    }
    this.json['Params'].push(attachmentParam);

    this.api.UniCall(
      this.json
    ).subscribe({
      next: (v) => {
        console.log(this.steps.length)

        if (this.steps.length != 0) {
          for (let index = 0; index < this.steps.length; index++) {
            this.steps[index].Case_ID = v[0][0].Case_ID
          }
          // console.log(JSON.stringify(this.steps))
          this.api.UniCall(
            {
              CommandText: 'egsQAStepInsertUpdate',
              Params: [
                {
                  Param: '@stepJson',
                  Value: JSON.stringify(this.steps)
                }
              ]
            }
          ).subscribe({
            next: (e) => {

              if (this.editCase != 0) {
                this.api.UniCall(
                  {
                    CommandText: 'egsQAStepDelete',
                    Params: [
                      {
                        Param: '@Case_StepID',
                        Value: this.deleteStepsFromEdit
                      },
                      {
                        Param: '@Case_ID',
                        Value: this.caseID.toString()
                      },
                      {
                        Param: '@deleteFromEdit',
                        Value: '1'
                      }
                    ]
                  }
                ).subscribe({
                  next: (e) => {
                    this.router.navigate(["projects/repository/" + this.LinkParamID])
                  },
                  error: (e) => {
                    alert("500 Internal Server Errors")
                    console.log(e)
                  }
                });
              } else {
                this.router.navigate(["projects/repository/" + this.LinkParamID])
              }

            },
            error: (e) => {
              alert("500 Internal Server Errors")
              console.log(e)
            }
          });
        } else {
          this.router.navigate(["projects/repository/" + this.LinkParamID])
        }
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    })
  }

  addStepInput() {
    this.steps.push(
      {
        Case_StepID: 0,
        Step_number: this.steps.length + 1,
        Step_Type: '1',
        Case_ID: 0,
        Step_Action: "",
        Step_InputData: "",
        Step_ExpectedResult: "",
        Step_Status: 1,
        SharedStep_ID: 0,
        Attachments_ID: '',
      }
    )
  }
  stepClicked(step: step, s: string) {
    this.addingAttachmentTo = this.steps.indexOf(step);
    this.uploadFrom = s;
  }
  addAttachment(event: any) {
    if (this.uploadFrom == 'case') {
      this.attachments.push(event[0]);
      this.attachments_id.push(event[0].Attachment_ID)
    }
    if (this.uploadFrom == 'step') {

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
  }
  popAttachment(value: number) {
    this.attachments_id.pop()
    var myIndex = this.attachments_id.indexOf(value);
    if (myIndex !== -1) {
      this.attachments_id.splice(myIndex, 1);
    }

    var attachmentObject = this.attachments.find((x: any) => x.Attachment_ID === value);

    var attachmentObjectIndex = this.attachments.indexOf(attachmentObject);
    if (attachmentObjectIndex !== -1) {
      this.attachments.splice(attachmentObjectIndex, 1);
    }

  }

  popStepAttachment(event: Event, step: step, value: number) {
    event.preventDefault();
    event.stopPropagation();
    var myIndex = this.steps[this.steps.indexOf(step)].Attachments_ID;
    // console.log(this.steps[this.steps.indexOf(step)].Attachments_ID);
    if (myIndex == undefined || myIndex == '') return

    var jsonStepAttachment = JSON.parse(myIndex);


    var tempAttachIndex = jsonStepAttachment.indexOf(value);
    if (tempAttachIndex !== -1) {
      jsonStepAttachment.splice(myIndex, 1);
    }
    this.steps[this.steps.indexOf(step)].Attachments_ID = JSON.stringify(jsonStepAttachment);
    // console.log(this.steps[this.steps.indexOf(step)].Attachments_ID);
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
  deleteStep(value: step) {
    const index: number = this.steps.indexOf(value);
    console.log(value);
    if (index !== -1) {
      this.steps.splice(index, 1);
    }
    let i = 1;
    this.steps.forEach(element => {
      element.Step_number = i;
      i++
    });


    if (this.deleteStepsFromEdit == "")
      this.deleteStepsFromEdit = value.Case_StepID.toString();
    else
      this.deleteStepsFromEdit = this.deleteStepsFromEdit + ', ' + value.Case_StepID;


  }

  addSharedStep() {

    this.api.UniCall(
      {
        CommandText: 'egsQASharedStepGet',
        Params: [
          {
            Param: '@SharedStep_ID',
            Value: this.selectedSharedstep.toString()
          },
          {
            Param: '@WithSteps',
            Value: '1'
          }
        ]
      }
    ).subscribe({
      next: (e) => {
        for (let index = 0; index < e[1].length; index++) {
          e[1][index].Case_StepID = '0';
          e[1][index].SharedStep_ID = '';
          this.steps.push(e[1][index]);
          console.log(this.steps);
        }

        let i = 1;
        this.steps.forEach(element => {
          element.Step_number = i;
          i++
        });
        this.openSharedStepModalBTN?.nativeElement.click();
        let AttachnmentLists: any = [];
        for (let index = 0; index < this.steps.length; index++) {
          let tmp = this.steps[index].Attachments_ID;
          if (tmp == undefined) {
            AttachnmentLists = [];
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
            console.log(result);
            this.listofAttachmentInStep = result[0];
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
  setCurrentSharedstep(s: step) {
    this.currentStep.push(s);
  }
  updateInsertSharedStep() {
    this.api.UniCall(
      {
        CommandText: 'egsQASharedStepInsertUpdate',
        Params: [
          {
            Param: '@SharedStep_Title',
            Value: this.sharedStepsTitle
          },
          {
            Param: '@stepJson',
            Value: JSON.stringify(this.currentStep)
          }
        ]
      }
    ).subscribe({
      complete: () => {
        this.openSharedModalBtn?.nativeElement.click();

      },
    });
  }
}
