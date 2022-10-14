import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { project, suite, testCase, testplan, testrun, defect } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { reloadPage } from '../../../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';
import { sidebarService } from '../../../../services/global-functions.service';
import Chart from 'chart.js/auto';

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

  LinkParamID: number = 0;
  Passed: number = 0;
  Failed: number = 0;
  Blocked: number = 0;
  Invalid: number = 0;
  Skipped: number = 0;
  Untested: number = 0;
  Completed: number = 0;
  Result: string = '';

  TestRun_ID: string = '';
  TestRun_Title: string = '';
  TestRun_Desc: string = '';
  TestPlan_ID: string = '';
  TestRun_Environment: string = '1';
  TestRun_Milestone: string = '';
  User_ID: string = '';
  TestRun_Tags: string = '';
  TestRun_CompletionRange: string = '';
  TestRun_DateCreated: string = '';
  TestRun_Status: string = '';
  TestRun_Passed: string = '';
  TestRun_Failed: string = '';
  TestRun_Untested: string = '';

  Project_ID: string = '';
  Project_Name: string = '';

  Suite_Name: string = '';

  Case_ID: string = '';
  Case_Title: string = '';
  Case_Desc: string = '';
  Case_Result: string = '';
  Case_Comment?: string = '';

  project: project[] = [];
  suites: suite[] = [];
  testcases: testCase[] = [];
  testplans: testplan[] = [];
  testruns: testrun[] = [];
  defects: defect[] = [];

  caseColumns: string[] = ['Checkbox', 'Result', 'Title', 'Assignee', 'TimeSpent', 'ThreeDots'];
  caseDataSource = new MatTableDataSource<testCase>();

  defectColumns: string[] = ['ID', 'Title', 'ReportedBy', 'DefectAssignee', 'External', 'Status', 'ThreeDots'];
  defectDataSource = new MatTableDataSource<defect>();

  statColumns: string[] = ['Image', 'User', 'StatTimeSpent', 'Passed', 'Failed', 'Blocked', 'Skipped', 'Invalid'];
  statDataSource = new MatTableDataSource<stat>(statData);

  @ViewChild('caseResultPanel') caseResultPanel!: ElementRef;
  @ViewChild('caseRunPanel') caseRunPanel!: ElementRef;

  public chart: any;

  constructor(private api: ApiService, private route: ActivatedRoute, private sidebarServ: sidebarService) { }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.TestRun_ID = this.route.snapshot.params['id'];
      this.getTestRun();
    }
    this.LinkParamID = this.sidebarServ.projectID;
    this.getProject();
    this.getSuite();
    this.getCase();
    this.getDefect();
  }

  getTestRun() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunGet',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID
          }
        ]
      }
    ).subscribe(value => {
      this.testruns = value[0];
      this.TestRun_ID = value[0][0].TestRun_ID;
      this.TestRun_Title = value[0][0].TestRun_Title;
      this.TestRun_Desc = value[0][0].TestRun_Desc;
      this.TestPlan_ID = value[0][0].TestPlan_ID;
      this.TestRun_Environment = value[0][0].TestRun_Environment;
      this.TestRun_Milestone = value[0][0].TestRun_Milestone;
      this.User_ID = value[0][0].User_ID;
      this.TestRun_CompletionRange = value[0][0].TestRun_CompletionRange;
      this.TestRun_DateCreated = value[0][0].TestRun_DateCreated;
      this.TestRun_Status = value[0][0].TestRun_Status;
      this.TestRun_Passed = value[0][0].TestRun_Passed;
      this.TestRun_Failed = value[0][0].TestRun_Failed;
      this.TestRun_Untested = value[0][0].TestRun_Untested;
    });
  }

  getProject() {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: Number(localStorage.getItem('currentProjectID')).toString()
          }
        ],
      }
    ).subscribe(value => {
      this.project = value[0];
      this.Project_ID = this.project[0].Project_ID.toString();
      this.Project_Name = this.project[0].Project_Name;
    });
  }

  getSuite() {
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
      this.Suite_Name = this.suites[0].Suite_Name;
    });
  }

  getCase() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunCasesGet',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID
          }
        ]
      }
    ).subscribe(value => {
      this.testcases = value[0];
      console.log(this.testcases)
      this.caseDataSource = new MatTableDataSource<testCase>(this.testcases);
      this.getCaseStatus();
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

  changeRunStatus(status: string) {
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

  openCaseModal(result: string) {
    this.Case_Result = result;
  }

  changeCaseResult() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunCasesUpdate',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          },
          {
            Param: '@Case_ID',
            Value: this.Case_ID.toString()
          },
          {
            Param: '@Case_Result',
            Value: this.Case_Result.toString()
          },
          {
            Param: '@Case_Comment',
            Value: this.Case_Comment
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

  updateProgress() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunInsertUpdate',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          },
          {
            Param: '@TestRun_Passed',
            Value: this.Passed.toString()
          },
          {
            Param: '@TestRun_Failed',
            Value: this.Failed.toString()
          },
          {
            Param: '@TestRun_Blocked',
            Value: this.Blocked.toString()
          },
          {
            Param: '@TestRun_Invalid',
            Value: this.Invalid.toString()
          },
          {
            Param: '@TestRun_Skipped',
            Value: this.Skipped.toString()
          },
          {
            Param: '@TestRun_Untested',
            Value: this.Untested.toString()
          },
          {
            Param: '@TestRun_CaseCount',
            Value: this.testcases.length.toString()
          },
        ]
      }
    ).subscribe({
      error: (e) => console.error(e)
    });
  }

  openCasePanel(row: testCase) {
    this.caseResultPanel.nativeElement.style.display = "flex";
    this.closeCaseRunPanel();
  }

  closeCasePanel() {
    this.caseResultPanel.nativeElement.style.display = "none";
  }

  // openCaseRunPanel(id: string, title: string, desc: string, comment: string) {
  //   this.caseRunPanel.nativeElement.style.display = "flex";
  //   this.Case_ID = id;
  //   this.Case_Title = title;
  //   this.Case_Desc = desc;
  //   this.Case_Comment = comment;
  //   this.closeCasePanel();
  // }
  openCaseRunPanel(row: testCase) {
    if (row.Case_Result > 0) {
      this.openCasePanel(row)
      this.closeCaseRunPanel()
    }
    if (row.Case_Result === 0) {
      this.caseRunPanel.nativeElement.style.display = "flex";
      this.Case_ID = row.Case_ID.toString();
      this.Case_Title = row.Case_Title;
      this.Case_Desc = row.Case_Desc;
      this.Case_Comment = row.Case_Comment;
      this.closeCasePanel();
    }
  }


  closeCaseRunPanel() {
    this.caseRunPanel.nativeElement.style.display = "none";
  }

  formatDate(date: string) {
    return date.substring(0, 10) + ' ' + date.substring(11, 21);
  }

  getCaseStatus() {
    for (let i = 0; i < this.testcases.length; i++) {
      if (this.testcases[i].Case_Result == 1)
        this.Passed++;
      else if (this.testcases[i].Case_Result == 2)
        this.Failed++;
      else if (this.testcases[i].Case_Result == 3)
        this.Blocked++;
      else if (this.testcases[i].Case_Result == 4)
        this.Invalid++;
      else if (this.testcases[i].Case_Result == 5)
        this.Skipped++;
      else
        this.Untested++;
    }
    this.getCompleted();
    this.createChart();
    this.updateProgress();
  }

  getCompleted() {
    var num = ((this.testcases.length - this.Untested) / this.testcases.length) * 100;
    this.Completed = +parseFloat(num.toString()).toFixed(2);
  }

  getProgress(num: number) {
    return (num / this.testcases.length) * 100;
  }

  createChart() {
    this.chart = new Chart("chart", {
      type: 'doughnut',
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      },
      data: {
        labels: [
          'Passed',
          'Failed',
          'Blocked',
          'Invalid',
          'Skipped',
          'Untested',
        ],
        datasets: [{
          data: [this.Passed, this.Failed, this.Blocked, this.Invalid, this.Skipped, this.Untested],
          backgroundColor: [
            '#94c64a',
            '#f66384',
            'rgb(221, 181, 10)',
            'rgb(95, 1, 185)',
            'rgb(175, 175, 175)',
            '#c1c1c1'
          ]
        }]
      }
    });
  }
}
