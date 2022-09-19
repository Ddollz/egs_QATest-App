import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Location } from "@angular/common";
import { testplan, testCase } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';

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
  testCase: testCase[] = [];
  displayedColumns: string[] = ['TestPlan_Title', 'TestPlan_RunTime', 'TestPlan_CaseCount', 'ThreeDots'];
  dataSource1 = new MatTableDataSource<testplan>();
  dataSource2 = new MatTableDataSource<testCase>();

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private api: ApiService) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit Test Plan';
      this.Button_title = 'Save';
      this.getTestPlan();
    }

    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: null
          }
        ],
      }
    ).subscribe(value => {
      this.testCase = value[0];
      this.dataSource2 = new MatTableDataSource<testCase>(this.testCase);
    });

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
            Value: this.TestPlan_ID.toString()
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

  applyFilter(event?: Event) {
    this.dataSource2.filterPredicate = function(data, filter: string): boolean {
      return data.Case_Title.toLowerCase().includes(filter) == filter.trim().toLowerCase().includes(filter);
    }
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource2.filter = filterValue.trim().toLowerCase();
    }
  }
}
