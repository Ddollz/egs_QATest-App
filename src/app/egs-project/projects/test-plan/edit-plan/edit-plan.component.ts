import { Component, OnInit } from '@angular/core';
import { testplan } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'

@Component({
  selector: 'app-edit-plan',
  templateUrl: './edit-plan.component.html',
  styleUrls: ['./edit-plan.component.css']
})
export class EditPlanComponent implements OnInit {

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';

  //Table Initialize
  testplan: testplan[] = [];
  displayedColumns: string[] = ['TestPlan_Title', 'TestPlan_RunTime', 'TestPlan_CaseCount', 'ThreeDots'];
  dataSource = new MatTableDataSource<testplan>();

  constructor(private api: ApiService, private router: Router) {
    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanGet',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.TestPlan_ID
          }
        ]
      }
    ).subscribe(value => {
      this.testplan = value[0];
      this.dataSource = new MatTableDataSource<testplan>(this.testplan);
    });
   }

  ngOnInit(): void {
  }

  // editViewPlan(id: string, name: string, desc: string, code: string){
  //   this.router.navigate(['/projects/plan/editplan']);
  //   this.TestPlan_ID = id;
  //   this.TestPlan_Title = name;
  //   this.TestPlan_Desc = desc;
  //   this.TestPlan_CaseCount = code;
  // }

}
