import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { testplan, testCase } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { reloadPage } from '../../../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';

// export interface testCase {
//   title: string;
//   time: string;
// }

// const caseData: testCase[] = [
//   { title: 'Access Shopping List Module', time: "00:00:15"},
//   { title: 'Create a Shopping List', time: "00:00:09"},
//   { title: 'Add product to Shopping List from Product List', time: "00:00:18"},
//   { title: 'Tag Shoplist as Favorite', time: "00:00:09"},
//   { title: 'Delete a Shopping List', time: "00:00:24"},
//   { title: 'Print a Shopping List', time: "00:00:09"},
//   { title: 'Add items to shopping list from basket', time: "00:00:12"},
//   { title: 'Add recipe to shopping list from recipe list', time: "00:00:18"},
// ];

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
  testCases: testCase[] = [];

  casesColumns: string[] = ['Title', 'Assignee', 'Expected_Duration'];
  casesDataSource = new MatTableDataSource<testCase>();

  @ViewChild('casePanel') casePanel!: ElementRef;
  @ViewChild('caseRunPanel') caseRunPanel!: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.getTestPlan();
    }
    console.log(this.index.toString())

    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanCasesGet',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.index.toString()
          }
        ]
      }
    ).subscribe(value => {
      // console.log(this.index);
      this.testCases = value[0];
      this.casesDataSource = new MatTableDataSource<testCase>(this.testCases);
      console.log(this.casesDataSource.filteredData)
    });

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
            Value: this.index.toString()
          }
        ]
      }
    ).subscribe(value => {
      // console.log(this.index);
      this.testplan = value[0][0];
      this.TestPlan_ID = value[0][0].TestPlan_ID;
      this.TestPlan_Title = value[0][0].TestPlan_Title;
      this.TestPlan_Desc = value[0][0].TestPlan_Desc;
      this.TestPlan_CaseCount = value[0][0].TestPlan_CaseCount;
      // this.Case_ID = value[0][0].Case_ID;
      // console.log(this.Case_ID)
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

  openCasePanel() {
    this.casePanel.nativeElement.style.display = "flex";
    this.closeCaseRunPanel();
  }

  closeCasePanel() {
    this.casePanel.nativeElement.style.display = "none";
  }

  openCaseRunPanel() {
    this.caseRunPanel.nativeElement.style.display = "flex";
    this.closeCasePanel();
  }

  closeCaseRunPanel() {
    this.caseRunPanel.nativeElement.style.display = "none";
  }

}
