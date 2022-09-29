import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import { project, suite, testCase, testrun, testplan, milestone } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { sidebarService } from '../../../../services/global-functions.service';

@Component({
  selector: 'app-run-create',
  templateUrl: './run-create.component.html',
  styleUrls: ['./run-create.component.css']
})
export class RunCreateComponent implements OnInit {

  index: number = 0;
  Page_title: string = 'Start test run';
  Button_title: string = 'Start run';

  // Utilities
  LinkParamID: number = 0;

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

  suites: suite[] = [];
  testcases: testCase[] = [];
  testruns: testrun[] = [];
  testplans: testplan[] = [];
  milestones: milestone[] = [];
  @Input() project = {} as project;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private sidebarServ: sidebarService, @Inject(LOCALE_ID) private locale: string) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit test run';
      this.Button_title = 'Save';
      this.getTestRun();
    }

    this.getSuite();
    this.getTestCase();
    this.getTestPlan();
    this.getMilestone();

    this.LinkParamID = sidebarServ.projectID;
    console.log('LinkParamID: ' + this.LinkParamID);
  }

  ngOnInit(): void {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    this.TestRun_DateCreated = formatDate(Date.now(),'yyyy-MM-dd HH:mm:ss', this.locale);

    // Default values
    this.TestRun_Title = 'Test run ' + yyyy + '/' + mm + '/' + dd;
    this.TestRun_Environment = '1';
    this.TestRun_Milestone = '0';
  }

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
            Value: this.LinkParamID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.project = value[0][0];
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
      console.log('Suites: ' + this.suites);
    });
  }

  getTestCase() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: '1122'
            // Value: this.LinkParamID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.testcases = value[0];
      console.log('Cases: ' + this.testcases);
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

  updateInsertTestRun() {
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
            Param: '@TestRun_Untested',
            Value: this.TestRun_Untested
          },
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["/projects/run"])
    });
  }

  applyFilter(event?: Event) {

  }
}
