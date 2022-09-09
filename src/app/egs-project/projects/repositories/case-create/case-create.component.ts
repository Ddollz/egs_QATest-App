import { Component, OnInit } from '@angular/core';
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

  //Attachment
  attachments: any = [];

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
            },
            {
              Param: '@WithStep',
              Value: 'true'
            }
          ],
        }
      ).subscribe(value => {
        this.steps = value[1];
        console.log(value);
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
      }
      );
    }
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
    this.json['CommandText'] = 'egsQACaseAndStepInsert';
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
    var stepjson = JSON.stringify(this.steps).toString();
    console.log(stepjson);
    console.log(this.steps);
    var temps = {
      Param: '@caseJson',
      Value: stepjson
    }
    this.json['Params'].push(temps);

    var tempStringForAttachment = '';
    for (let index = 0; index < this.attachments.length; index++) {
      for (let o = 0; o < this.attachments[index].length; o++) {
        tempStringForAttachment = this.attachments[index][o].CaseAttachment_ID + ',' + tempStringForAttachment;
      }
    }

    var attachmentParam = {
      Param: '@attachJson',
      Value: tempStringForAttachment.slice(0, -1).toString()
    }
    this.json['Params'].push(attachmentParam);
    console.log(this.json);
    this.api.UniCall(
      this.json
    ).subscribe({
      next: (v) => this.router.navigate(["projects/repository/" + this.LinkParamID]),
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
        Step_Status: 1
      }
    )
  }
  addAttachment(event: any) {
    this.attachments.push(event);
    console.log(this.attachments);
  }
  deleteAttachment(value: number) {

    var file_ID = value;
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
      complete: () => {
        reloadPage();
      }
    })

  }
}
