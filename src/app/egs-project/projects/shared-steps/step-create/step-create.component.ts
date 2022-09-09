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
          this.steps = e[1]
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
        SharedStep_ID: 0
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
        SharedStep_ID: 0
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
}
