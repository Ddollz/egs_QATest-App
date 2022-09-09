import { Component, OnInit } from '@angular/core';
import { sharedStep, sharedStep2 } from '../../../../models/project/project.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  sharedSteps: sharedStep[] = [];
  sharedSteps2: sharedStep2[] = [];

  SharedStep_ID: string = '';
  SharedStep_Title: string = '';

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit shared step';
      this.Button_title = 'Save';
      this.getSharedStep();
    }
  }

  getSharedStep() {

  }

  addSharedStep2() {
    this.sharedSteps2.push(
      {
        SharedStep2_Code: 0,
        SharedStep2_ID: 0,
        SharedStep2_Number: this.sharedSteps2.length + 1,
        SharedStep2_Action: "",
        SharedStep2_InputData: "",
        SharedStep2_ExpectedResult: ""
      }
    )
  }

  cloneSharedStep2(action: string, input: string, result: string) {
    this.sharedSteps2.push(
      {
        SharedStep2_Code: 0,
        SharedStep2_ID: 0,
        SharedStep2_Number: this.sharedSteps2.length + 1,
        SharedStep2_Action: action,
        SharedStep2_InputData: input,
        SharedStep2_ExpectedResult: result
      }
    )
  }

  deleteSharedStep2() {
    this.sharedSteps2.pop();
  }

  updateInsertSharedStep() {
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
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    this.json['CommandText'] = 'egsQASharedStep2Insert';
    this.json['Params'] = [];

    var sharedStep2Json = JSON.stringify(this.sharedSteps2).toString();
    console.log(sharedStep2Json);
    var temp = {
      Param: '@SharedStep2Json',
      Value: sharedStep2Json
    }
    this.json['Params'].push(temp);

    this.api.UniCall(
      this.json
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["projects/shared-steps"])
    })
  }
}
