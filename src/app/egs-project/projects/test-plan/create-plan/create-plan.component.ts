import {  AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { testplan, testCase, suite, project, testplanCases } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { sidebarService } from '../../../../services/global-functions.service';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']
})
export class CreatePlanComponent implements OnInit {

  //Utilities
  LinkParamID: number = 0;
  S_ID: number = 0;
  S_Name: string ='';
  S_Desc: string ='';

  test: number = 8;

  //Activated Route
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

  //Project Modals
  suites: suite[] = [];
  testplans: testplan[] = [];
  testCases: testCase[] = [];
  testplanCases: testplanCases [] = [];
  @Input() project = {} as project;

  //Table
  displayedColumns: string[] = ['TestCase_CheckBox', 'TestCase_Add', 'TestCase_Title'];
  testCasesdataSource = new MatTableDataSource<testCase>();
  suitedataSource = new MatTableDataSource<suite>();
  tpCasesDataSource = new MatTableDataSource<testplanCases>();

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private sidebarServ: sidebarService) {
    
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit Test Plan';
      this.Button_title = 'Save';
      this.getTestPlan();
      
    }

    this.LinkParamID = sidebarServ.projectID;
    console.log(this.LinkParamID);

    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.LinkParamID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.project = value[0][0];
    });

    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.LinkParamID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.suites = value[0];
    });

    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanCasesGet',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.test.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.testplanCases = value[0];
      this.tpCasesDataSource = new MatTableDataSource<testplanCases>(this.testplanCases);
      console.log(this.tpCasesDataSource.filteredData);
    });

  }

  ngOnInit(): void {
  }

  receiveName($event: string){
    this.S_Name = $event
  }
  

  receiveDesc($event: string){
    this.S_Desc = $event
  }

  receiveID($event: number){
    this.S_ID = $event

    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Suite_ID',
            Value: this.S_ID.toString()
            // Value: this.LinkParamID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.testCases = value[0];
      this.testCasesdataSource = new MatTableDataSource<testCase>(this.testCases);
      // console.log(this.testCases);
      console.log(this.testCasesdataSource);
      console.log(this.testCasesdataSource.filteredData)
      // console.log(this.S_ID);
    });
  }

  selectCase($event: any, ID: number, Name: string){
    // alert(event.checked);
    if($event.checked){
      alert(ID)
      // alert(Name)

    }
    else{

    }
  }

  getSelectedCaseID(ID: number){
    alert(ID);
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
          },
          {
            Param: '@Case_ID',
            Value: "[29,28]"
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["/projects/plan"])
    });
  }

  updateInsertTestPlanCases(){
    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanCasesInsertUpdate',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.TestPlan_ID.toString()
          },
          {
            Param: '@Case_ID',
            Value: this.Case_ID.toString()
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
            Value: this.index.toString()
          }
        ]
      }
    ).subscribe(value => {
      // console.log(value);
      // console.log(value[0]);
      // console.log(value[0][0]);
      this.testplans = value[0][0];
      this.TestPlan_ID = value[0][0].TestPlan_ID;
      this.TestPlan_Title = value[0][0].TestPlan_Title;
      this.TestPlan_Desc = value[0][0].TestPlan_Desc;
      this.TestPlan_CaseCount = value[0][0].TestPlan_CaseCount;
    });
  }

  applyFilter(event?: Event) {
    this.suitedataSource.filterPredicate = function(data, filter: string): boolean {
      return data.Suite_Name.toLowerCase().includes(filter) == filter.trim().toLowerCase().includes(filter);
    }
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.suitedataSource.filter = filterValue.trim().toLowerCase();
    }
  }
}
