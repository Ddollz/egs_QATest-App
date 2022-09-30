import { Component, OnInit } from '@angular/core';
import { testplan } from '../../../models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { reloadPage, sidebarService } from '../../../services/global-functions.service';

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
  displayedColumns: string[] = ['TestPlan_Title', 'TestPlan_RunTime', 'TestPlan_CaseCount', 'ThreeDots'];
  dataSource = new MatTableDataSource<testplan>();

  constructor(private api: ApiService, private router: Router, private sidebarServ: sidebarService) {
    // console.log(sidebarServ.projectID)
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

  openDeleteModal(id: string, title: string) {
    this.TestPlan_ID = id;
    this.TestPlan_Title = title;
  }

  deleteTestPlan() {
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
