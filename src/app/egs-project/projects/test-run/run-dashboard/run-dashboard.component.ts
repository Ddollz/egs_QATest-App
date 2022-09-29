import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { project, suite, testCase, testrun, testplan, defect } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { reloadPage } from '../../../../services/global-functions.service';

export interface tcase {
  result: number;
  title: string;
  time: string;
}

export interface stat {
  user: string;
  role: string;
  time: string;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  invalid: number;
}

// const caseData: tcase[] = [
//   { result: 1, title: 'Login user for the first time', time: "00:00:00" },
//   { result: 0, title: 'Login user', time: "00:00:04" },
//   { result: 0, title: 'Login user without verifying email', time: "00:00:12" }
// ];

const statData: stat[] = [
  { user: 'User 1', role: "Administrator", time: "00:00:12", passed: 1, failed: 1, blocked: 1, skipped: 1, invalid: 1 },
  { user: 'User 2', role: "Administrator", time: "00:00:12", passed: 1, failed: 1, blocked: 1, skipped: 1, invalid: 1 },
  { user: 'User 3', role: "Administrator", time: "00:00:12", passed: 1, failed: 1, blocked: 1, skipped: 1, invalid: 1 }
];

@Component({
  selector: 'app-run-dashboard',
  templateUrl: './run-dashboard.component.html',
  styleUrls: ['./run-dashboard.component.css']
})
export class RunDashboardComponent implements OnInit {

  index: number = 0;

  // Update and Insert Variables
  TestRun_ID: string = '';
  TestRun_Title: string = '';
  TestRun_Desc: string = '';
  TestPlan_ID: string = '';
  TestRun_Environment: string = '1';
  TestRun_Milestone: string = '';
  User_ID: string = '1';
  TestRun_Tags: string = '';
  TestRun_CompletionRange: string = '';
  TestRun_DateCreated: string = '';
  TestRun_Status: string = '0';
  TestRun_Passed: string = '0';
  TestRun_Failed: string = '0';
  TestRun_Untested: string = '0';

  projects: project[] = [];
  suites: suite[] = [];
  testcases: testCase[] = [];
  testruns: testrun[] = [];
  testplans: testplan[] = [];
  defects: defect[] = [];

  caseColumns: string[] = ['Checkbox', 'Result', 'Title', 'Assignee', 'TimeSpent', 'ThreeDots'];
  caseDataSource = new MatTableDataSource<testCase>();

  defectColumns: string[] = ['ID', 'Title', 'ReportedBy', 'DefectAssignee', 'External', 'Status', 'ThreeDots'];
  defectDataSource = new MatTableDataSource<defect>();

  statColumns: string[] = ['Image', 'User', 'StatTimeSpent', 'Passed', 'Failed', 'Blocked', 'Skipped', 'Invalid'];
  statDataSource = new MatTableDataSource<stat>(statData);

  @ViewChild('casePanel') casePanel!: ElementRef;
  @ViewChild('caseRunPanel') caseRunPanel!: ElementRef;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.getTestRun();
    }

    this.getProject();
    this.getSuite();
    this.getCase();
    this.getDefect();
  }

  ngOnInit(): void { }

  getTestRun() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunGet',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: null
          }
        ]
      }
    ).subscribe(value => {
      console.log(value[0]);
      this.testruns = value[0];
      this.TestRun_ID = value[0][this.index].TestRun_ID;
      this.TestRun_Title = value[0][this.index].TestRun_Title;
      this.TestRun_Desc = value[0][this.index].TestRun_Desc;
      this.TestPlan_ID = value[0][this.index].TestPlan_ID;
      this.TestRun_Environment = value[0][this.index].TestRun_Environment;
      this.TestRun_Milestone = value[0][this.index].TestRun_Milestone;
      this.User_ID = value[0][this.index].User_ID;
      this.TestRun_CompletionRange = value[0][this.index].TestRun_CompletionRange;
      this.TestRun_DateCreated = value[0][this.index].TestRun_DateCreated;
      this.TestRun_Status = value[0][this.index].TestRun_Status;
      this.TestRun_Passed = value[0][this.index].TestRun_Passed;
      this.TestRun_Failed = value[0][this.index].TestRun_Failed;
      this.TestRun_Untested = value[0][this.index].TestRun_Untested;
    });
  }

  getProject() {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: '4'
          }
        ]
      }
    ).subscribe(value => {
      this.projects = value[0];
    });
  }

  getSuite() {
    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Suite_ID',
            Value: '1145'
          }
        ]
      }
    ).subscribe(value => {
      this.suites = value[0];
    });
  }

  getCase() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: '22'
          }
        ]
      }
    ).subscribe(value => {
      this.testcases = value[0];
      this.caseDataSource = new MatTableDataSource<testCase>(this.testcases);
    });
  }

  getDefect() {
    this.api.UniCall(
      {
        CommandText: 'egsQADefectGet',
        Params: [
          {
            Param: '@WithAll',
            Value: 'true'
          }
        ]
      }
    ).subscribe(value => {
      this.defects = value[0];
      this.defectDataSource = new MatTableDataSource<defect>(this.defects);
    });
  }

  changeStatus(status: number) {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunInsertUpdate',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          },
          {
            Param: '@TestRun_Status',
            Value: status
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
