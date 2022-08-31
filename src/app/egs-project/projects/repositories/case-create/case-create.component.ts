import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { reloadPage } from '../../../../services/global-functions.service';
import { suite, step } from '../../../../models/project/project.model';
import { ActivatedRoute } from '@angular/router';


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

  //Models
  suites: suite[] = [];
  steps: step[] = [];

  //Modal Variables
  Modal_Title: string = 'Upload Attachment';
  Modal_btn: string = 'Upload Attachment';

  //forms
  caseForm !: FormGroup;
  stepForm !: FormGroup;


  constructor(private formBuilder: FormBuilder, private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.LinkParamID = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    console.log(activatedRoute);

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
      this.caseForm.controls['@Suite_ID'].setValue(this.suites[0].Suite_ID);
    }
    );

  }

  ngOnInit(): void {
    this.caseForm = this.formBuilder.group({
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


    // this.caseForm = this.formBuilder.group({
    //   '@Case_Title': [null],
    //   '@Case_Status': ['1'],
    //   '@Case_Desc': [null],
    // })
  }
  createCase() {
    this.json['CommandText'] = 'egsQACaseAndStepInsert';
    this.json['Params'] = [];

    for (const field in this.caseForm.controls) { // 'field' is a string
      const control = this.caseForm.get(field)?.value; // 'control' is a FormControl
      var temp = {
        Param: field,
        Value: control.toString()
      }
      this.json['Params'].push(temp);
    }


    var stepjson = JSON.stringify(this.steps).toString();
    console.log(stepjson);
    var temps = {
      Param: '@caseJson',
      Value: stepjson
    }
    this.json['Params'].push(temps);

    this.api.UniCall(
      this.json
    ).subscribe(
      {
        next(position: any) {
          console.log(position);
        },
        error(msg) {
          console.log(msg);
          alert("500 Internal Server Errors")
        },
        complete() {
          reloadPage();
        }
      }
    );

  }

  addStepInput() {
    this.steps.push(
      {
        Case_StepID: '',
        Step_number: (this.steps.length + 1).toString(),
        Step_Type: '1',
        Case_ID: '',
        Step_Action: "",
        Step_InputData: "",
        Step_ExpectedResult: "",
        Step_Status: '1'
      }
    )
    console.log(this.steps);
  }
}
