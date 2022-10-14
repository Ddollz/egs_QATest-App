import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import { suite, testCase, testrun, testplan, step, milestone } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { sidebarService } from '../../../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-run-create',
  templateUrl: './run-create.component.html',
  styleUrls: ['./run-create.component.css']
})
export class RunCreateComponent implements OnInit {

  Page_title: string = 'Start test run';
  Button_title: string = 'Start run';

  Project_ID: number = 0;
  Suite_ID: string = '';
  Suite_Name: string = '';
  Suite_Desc: string = '';
  addCasesLength = 0;
  ACLength = 0;
  finalAddCases = '';
  finalAddSteps = '';

  TestRun_ID: string = '';
  TestRun_Title: string = '';
  TestRun_Desc: string = '';
  TestPlan_ID: string = '';
  TestRun_Environment: string = '';
  TestRun_Milestone: string = '';
  User_ID: string = '';
  TestRun_Tags: string = '';
  TestRun_CompletionRange: string = '';
  TestRun_DateCreated: string = '';
  TestRun_Status: string = '';
  TestRun_Passed: string = '';
  TestRun_Failed: string = '';
  TestRun_Blocked: string = '';
  TestRun_Invalid: string = '';
  TestRun_Skipped: string = '';
  TestRun_Untested: string = '';
  TestRun_CaseCount: string = '';

  suites: suite[] = [];
  testcases: testCase[] = [];
  testruns: testrun[] = [];
  testplans: testplan[] = [];
  milestones: milestone[] = [];
  steps: step[] = [];
  addCases: number[] = [];
  addSteps: number[] = [];

  displayedColumns: string[] = ['Checkbox', 'Title'];
  dataSource = new MatTableDataSource<testCase>();

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private sidebarServ: sidebarService, @Inject(LOCALE_ID) private locale: string) {
    this.Project_ID = Number(localStorage.getItem('currentProjectID'));
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id']) {
      this.TestRun_ID = this.route.snapshot.params['id'];
      this.Page_title = 'Edit test run';
      this.Button_title = 'Save';
      this.getTestRun();
    }
    this.getSuite();
    this.getTestCase();
    this.getTestPlan();
    this.getMilestone();

    // Default values
    this.TestRun_Title = 'Test run ' + formatDate(Date.now(), 'yyyy/MM/dd', this.locale);
    this.TestRun_DateCreated = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
    this.TestRun_Environment = '1';
    this.TestRun_Milestone = '0';
    this.TestRun_Status = '0';
    this.TestRun_Passed = '0';
    this.TestRun_Failed = '0';
    this.TestRun_Blocked = '0';
    this.TestRun_Invalid = '0';
    this.TestRun_Skipped = '0';
    this.TestRun_Untested = '0';
    this.TestRun_CaseCount = '0';
    this.User_ID = '1';
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
      this.TestRun_Environment = value[0][0].TestRun_Environment.toString();
      this.TestRun_Milestone = value[0][0].TestRun_Milestone.toString();
      this.User_ID = value[0][0].User_ID;
      this.TestRun_CompletionRange = value[0][0].TestRun_CompletionRange;
      this.TestRun_DateCreated = value[0][0].TestRun_DateCreated;
      this.TestRun_Status = value[0][0].TestRun_Status;
      this.TestRun_Passed = value[0][0].TestRun_Passed;
      this.TestRun_Failed = value[0][0].TestRun_Failed;
      this.TestRun_Blocked = value[0][0].TestRun_Blocked;
      this.TestRun_Invalid = value[0][0].TestRun_Invalid;
      this.TestRun_Skipped = value[0][0].TestRun_Skipped;
      this.TestRun_Untested = value[0][0].TestRun_Untested;
      this.TestRun_CaseCount = value[0][0].TestRun_CaseCount;
    });
  }

  receiveID($event: number) {
    this.Suite_ID = $event.toString();
    this.getTestCase();
    console.log(this.testcases);
  }

  receiveName($event: string) {
    this.Suite_Name = $event;
  }

  receiveDesc($event: string) {
    this.Suite_Desc = $event;
  }

  getSuite() {
    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.suites = value[0];
    });
  }

  getTestCase() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Suite_ID',
            Value: this.Suite_ID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.testcases = value[0];
      this.dataSource = new MatTableDataSource<testCase>(this.testcases);
    });
  }

  getTestPlan() {
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
      this.testplans = value[0];
    });
  }

  getMilestone() {
    this.api.UniCall(
      {
        CommandText: 'egsQAMilestoneGet',
        Params: [
          {
            Param: '@Milestone_ID',
            Value: null
          }
        ]
      }
    ).subscribe(value => {
      this.milestones = value[0];
    });
  }

  selectCase($event: any, ID: number) {
    if ($event.checked) {
      this.addCases.push(ID)
      this.addCases = [...new Set(this.addCases)]
      this.addCasesLength = this.addCases.length
      this.getStep(ID)
    }
  }

  getSelectedCase() {
    this.finalAddCases = "[" + this.addCases + "]"
    this.ACLength = this.addCasesLength
  }

  closeAddCases() {
    this.addCases = [];
  }

  updateInsertTestRun() {
    var case_count = '0';
    var untested = '0';

    if (this.addCasesLength == 0) {
      case_count = this.TestRun_CaseCount;
      untested = this.TestRun_Untested;
    }
    else {
      case_count = this.addCasesLength.toString();
      untested = case_count;
    }

    console.log('add steps:' + this.addSteps);

    this.api.UniCall(
      {
        CommandText: 'egsQATestRunInsertUpdate',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          },
          {
            Param: '@TestRun_Title',
            Value: this.TestRun_Title
          },
          {
            Param: '@TestRun_Desc',
            Value: this.TestRun_Desc
          },
          {
            Param: '@TestPlan_ID',
            Value: this.TestPlan_ID.toString()
          },
          {
            Param: '@TestRun_Environment',
            Value: this.TestRun_Environment
          },
          {
            Param: '@TestRun_Milestone',
            Value: this.TestRun_Milestone.toString()
          },
          {
            Param: '@User_ID',
            Value: this.User_ID
          },
          {
            Param: '@TestRun_Tags',
            Value: this.TestRun_Tags
          },
          {
            Param: '@TestRun_CompletionRange',
            Value: this.TestRun_CompletionRange
          },
          {
            Param: '@TestRun_DateCreated',
            Value: this.TestRun_DateCreated
          },
          {
            Param: '@TestRun_Status',
            Value: this.TestRun_Status
          },
          {
            Param: '@TestRun_Passed',
            Value: this.TestRun_Passed
          },
          {
            Param: '@TestRun_Failed',
            Value: this.TestRun_Failed
          },
          {
            Param: '@TestRun_Blocked',
            Value: this.TestRun_Blocked
          },
          {
            Param: '@TestRun_Invalid',
            Value: this.TestRun_Invalid
          },
          {
            Param: '@TestRun_Skipped',
            Value: this.TestRun_Skipped
          },
          {
            Param: '@TestRun_Untested',
            Value: untested
          },
          {
            Param: '@TestRun_CaseCount',
            Value: case_count
          },
          {
            Param: '@Case_ID',
            Value: this.finalAddCases.toString()
          },
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["/projects/run"])
    });
  }

  getStep(id: number) {
    this.api.UniCall(
      {
        CommandText: 'egsQAStepGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: id.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.steps = value[0];
    });

    for (let i = 0; i < this.steps.length; i++) {
      this.addSteps.push(this.steps[i].Case_StepID);
    }
  }

  applyFilter(event?: Event) {

  }
}
