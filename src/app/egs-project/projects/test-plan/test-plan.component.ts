import { Component, OnInit } from '@angular/core';
import { testplan } from '../../../models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-test-plan',
  templateUrl: './test-plan.component.html',
  styleUrls: ['./test-plan.component.css']
})
export class TestPlanComponent implements OnInit {

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';

  //Table Initialize
  testplan: testplan[] = [];
  displayedColumns: string[] = ['Title', 'RunTime', 'Cases', 'ThreeDots'];
  dataSource = new MatTableDataSource<testplan>();

  constructor(private api: ApiService) {
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
      this.dataSource = new MatTableDataSource<testplan>(this.testplan);
    });
   }

  ngOnInit(): void {
  }

}
