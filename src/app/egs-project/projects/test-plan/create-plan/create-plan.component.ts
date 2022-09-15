import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Location } from "@angular/common";
import { testplan } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']
})
export class CreatePlanComponent implements OnInit {

  index: number = 0;
  Page_title: string = 'Create Test Plan';
  Button_title: string = 'Create Plan';

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';
  TestPlan_RunTime: string = '';
  Case_ID: string = '';
  
  testplan: testplan[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private api: ApiService) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit Test Plan';
      this.Button_title = 'Save';
      this.getTestPlan();
    }

   }

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
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["/projects/plan"])
    });
  }

  getTestPlan(){
    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanGet',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: null
          }
        ]
      }
    ).subscribe(value => {
      this.testplan = value[0];
      this.TestPlan_ID = value[0][this.index].TestPlan_ID;
      this.TestPlan_Title = value[0][this.index].TestPlan_Title;
      this.TestPlan_Desc = value[0][this.index].TestPlan_Desc;
      this.TestPlan_CaseCount = value[0][this.index].TestPlan_CaseCount;
    });
  }
}
