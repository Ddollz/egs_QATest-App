import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { testplan } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { reloadPage } from '../../../../services/global-functions.service';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css']
})
export class ViewPlanComponent implements OnInit {

  index: number = 0;

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';
  TestPlan_RunTime: string = '';
  Case_ID: string = '';

  testplan: testplan[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.getTestPlan();
    }
   }

  ngOnInit(): void {
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

  openDeleteModal(id: string, title: string) {
    this.TestPlan_ID = id;
    this.TestPlan_Title = title;
  }

  deleteTestPlan(){
    console.log(this.TestPlan_ID)
    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanDelete',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.TestPlan_ID.toString()
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

}
