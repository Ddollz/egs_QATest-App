import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { reloadPage } from '../../../../services/global-functions.service';
import { suite, step } from '../../../../models/project/project.model';
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
  createCaseSuiteEdit: boolean = false;
  createCaseSuite: number = 0;

  //Models
  suites: suite[] = [];
  steps: step[] = [];

  //Modal Variables
  Modal_Title: string = 'Upload Attachment';
  Modal_btn: string = 'Upload Attachment';

  //forms
  caseForm !: FormGroup;
  stepForm !: FormGroup;


  constructor(private formBuilder: FormBuilder, private api: ApiService, private activatedRoute: ActivatedRoute, public sidebarServ: sidebarService, private router: Router) {
    this.LinkParamID = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.createCaseSuite = Number(this.activatedRoute.snapshot.queryParamMap.get('suite'));

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
      if (this.createCaseSuite == 0 && !this.createCaseSuiteEdit) {
        this.caseForm.controls['@Suite_ID'].setValue(this.suites[0].Suite_ID);
      } else {
        this.caseForm.controls['@Suite_ID'].setValue(this.createCaseSuite);
      }
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
    var temps = {
      Param: '@caseJson',
      Value: stepjson
    }
    this.json['Params'].push(temps);

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
  }
}
