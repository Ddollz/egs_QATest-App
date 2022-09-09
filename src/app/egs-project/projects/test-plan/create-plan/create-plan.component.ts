import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Location } from "@angular/common";
import { testplan } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']
})
export class CreatePlanComponent implements OnInit {

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';
  TestPlan_RunTime: string = '';
	Case_ID: string = '';
  
  testplan: testplan[] = [];

  constructor(private router: Router, private location: Location, private api: ApiService) { }

  ngOnInit(): void {
  }

  updateInsertTestPlan() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanInsertUpdate',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.TestPlan_ID
          },
          {
            Param: '@TestPlan_Title',
            Value: this.TestPlan_Title
          },
          {
            Param: '@TestPlan_Desc',
            Value: this.TestPlan_Desc
          },
          {
            Param: '@TestPlan_CaseCount',
            Value: this.TestPlan_CaseCount
          },
          {
            Param: '@TestPlan_RunTime',
            Value: this.TestPlan_RunTime
          }
        ]
      }
    ).subscribe({
      next: (v) => this.router.navigate(["/projects/plan"]),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }
}
