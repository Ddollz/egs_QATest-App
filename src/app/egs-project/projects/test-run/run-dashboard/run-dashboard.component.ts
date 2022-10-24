import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { project, suite, testCase, testplan, testrun, defect, milestone } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { reloadPage } from '../../../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';
import { sidebarService } from '../../../../services/global-functions.service';
import Chart from 'chart.js/auto';
import { KeyValue } from '@angular/common';
import { user } from 'src/app/models/workspace/workspace.model';

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


@Component({
  selector: 'app-run-dashboard',
  templateUrl: './run-dashboard.component.html',
  styleUrls: ['./run-dashboard.component.css']
})
export class RunDashboardComponent implements OnInit {

  TemporaryUser_ID: number = 1 //! Change and remove this when login is working;

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

  //?Assigning User
  Result_ID?: number;
  Case_Assignee?: number;
  //?Assigning User

  currentCase = {} as testCase;
  currentSuite?: suite;

  project: project[] = [];
  suites: suite[] = [];
  testcases: testCase[] = [];
  testplans: testplan[] = [];
  testruns: testrun[] = [];
  defects: defect[] = [];
  testrunStat: any = [];
  steps: any[] = [];
  stepAttachments: any = [];
  caseColumns: string[] = ['Checkbox', 'Result', 'Title', 'Assignee', 'TimeSpent', 'ThreeDots'];
  caseDataSource = new MatTableDataSource<testCase>();
  finalCaseDataSource: any = {};

  defectColumns: string[] = ['ID', 'Title', 'ReportedBy', 'DefectAssignee', 'External', 'Status', 'ThreeDots'];
  defectDataSource = new MatTableDataSource<defect>();

  statColumns: string[] = ['Image', 'User', 'StatTimeSpent', 'Passed', 'Failed', 'Blocked', 'Skipped', 'Invalid'];
  users: user[] = [];
  statDataSource = new MatTableDataSource<stat>();

  @ViewChild('caseResultPanel') caseResultPanel!: ElementRef;
  @ViewChild('caseRunPanel') caseRunPanel!: ElementRef;

  //milestones
  milestones: milestone[] = [];

  //Defect
  user_id_defect: number = 0;
  title_defect: string = "";
  milestone_defect: number = 0;
  severity_defect: number = 0;


  public chart: any;

  constructor(private api: ApiService, private route: ActivatedRoute, private sidebarServ: sidebarService) {

    if (this.route.snapshot.params['id']) {
      this.TestRun_ID = this.route.snapshot.params['id'];
      this.getTestRun();
    }
    this.LinkParamID = this.sidebarServ.projectID;
    this.getProject();
    this.getCase();
    this.getDefect();


    this.api.UniCall(
      {
        CommandText: 'egsQATestRunStatGet',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.testrunStat = value[0];
      this.statDataSource = new MatTableDataSource<any>(this.testrunStat);

    });



    this.api.UniCall(
      {
        CommandText: 'egsQAAccountGet',
        Params: [
          {
            Param: '@User_Email',
            Value: ''
          }
        ],
      }
    ).subscribe(value => {
      this.users = value[0];
    }
    );

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

  ngOnInit(): void {
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

  SuiteID_List: any = [];
  SuiteName_List: any = [];
  suiteBar_List: any = [];

  getSuite(id: any) {
    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Suite_List',
            Value: id
          }
        ],
      }
    ).subscribe(value => {
      this.suites = value[0];
      var temp = this.suites.filter(n => n.Parent_SuiteID)
      for (let index = 0; index < temp.length; index++) {
        var parent = this.suites.filter(x => x.Suite_ID === temp[index].Parent_SuiteID);
        this.SuiteID_List.push(temp[index].Suite_ID);
        if (parent.length > 0) {
          this.SuiteID_List.push(parent[0].Suite_ID);
          this.getChildTreeSuite(parent[0])
        }
        //?
        var Filtered: any = {};
        var mapped = this.SuiteID_List.map((obj: any) => {
          return this.suites.find(n => n.Suite_ID === obj)?.Suite_Name
        })
        const item = mapped.reverse().map((n: any, i: any, arr: any) => {
          if (arr.length - 1 === i) return n
          return n + " > "
        });
        const html = item.join('')
        Filtered[temp[index].Suite_ID] = html
        this.SuiteName_List.push(Filtered)
        Filtered = {};
        this.SuiteID_List = [];
      }
      //? For sub desc

      //? For progressbar per suites
      var idsInArray = id.split(" ").filter((a: any) => a);
      for (let index = 0; index < idsInArray.length; index++) {
        this.getCaseStatus(idsInArray[index]);
        var barFilled: any = {};
        barFilled['Passed'] = this.getProgress(this.Passed, idsInArray[index])
        barFilled['Failed'] = this.getProgress(this.Failed, idsInArray[index])
        barFilled['Blocked'] = this.getProgress(this.Blocked, idsInArray[index])
        barFilled['Invalid'] = this.getProgress(this.Invalid, idsInArray[index])
        barFilled['Skipped'] = this.getProgress(this.Skipped, idsInArray[index])
        barFilled['Untested'] = this.getProgress(this.Untested, idsInArray[index])
        var Filtereds: any = {};

        Filtereds[idsInArray[index]] = barFilled
        this.suiteBar_List.push(Filtereds)
      }
      //? For progressbar per suites

    });
  }


  getProgress(num: number, id: number) {
    return (num / this.testcases.filter((n: any) => n.Suite_ID.toString() == id.toString()).length) * 100;
  }

  getCaseStatus(id: number) {
    this.Passed = this.testcases.filter((n: any) => n.Case_Result == 1 && n.Suite_ID.toString() === id.toString()).length
    this.Failed = this.testcases.filter((n: any) => n.Case_Result == 2 && n.Suite_ID.toString() === id.toString()).length
    this.Blocked = this.testcases.filter((n: any) => n.Case_Result == 3 && n.Suite_ID.toString() === id.toString()).length
    this.Invalid = this.testcases.filter((n: any) => n.Case_Result == 4 && n.Suite_ID.toString() === id.toString()).length
    this.Skipped = this.testcases.filter((n: any) => n.Case_Result == 5 && n.Suite_ID.toString() === id.toString()).length
    this.Untested = this.testcases.filter((n: any) => n.Case_Result <= 0 && n.Suite_ID.toString() === id.toString()).length
  }



  //? Looping child
  getChildTreeSuite(id: any) {
    var parent = this.suites.filter(x => x.Suite_ID === id.Parent_SuiteID);
    if (parent.length > 0) {
      this.SuiteID_List.push(parent[0].Suite_ID);
      this.getChildTreeSuite(parent[0])
    }
  }

  collapseChevronIcon(event: Event) {
    var dom = event.currentTarget as HTMLElement;
    if (dom.querySelector('i')?.classList.contains('bi-chevron-down'))
      dom.querySelector('i')?.classList.replace('bi-chevron-down', 'bi-chevron-right')
    else
      dom.querySelector('i')?.classList.replace('bi-chevron-right', 'bi-chevron-down')
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
      var temp = '';
      for (let index = 0; index < this.testcases.length; index++) {
        if (this.finalCaseDataSource.hasOwnProperty(this.testcases[index].Suite_ID)) {
          this.finalCaseDataSource[this.testcases[index].Suite_ID].push(this.testcases[index]);
        } else {
          temp = temp + ' ' + this.testcases[index].Suite_ID;
          this.finalCaseDataSource[this.testcases[index].Suite_ID] = [];
          this.finalCaseDataSource[this.testcases[index].Suite_ID].push(this.testcases[index]);
        }
      }
      this.caseDataSource = new MatTableDataSource<testCase>(this.testcases);
      this.getCompleted();
      this.getSuite(temp);
      this.createChart();

    });
  }
  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return 0;
  }
  getDefect() {
    this.api.UniCall(
      {
        CommandText: 'egsQADefectGet',
        Params: [
          {
            Param: '@WithAll',
            Value: 'true'
          },
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID
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

  runAgainCase(id?: number) {
    let currentDateTime = new Date();
    console.log(this.currentCase)
    if (id != null) {
      var temp = this.testcases.find((n: any) => n.Result_ID === id)
      if (temp) {
        let index = this.testcases.indexOf(temp);
        this.testcases[index].Case_Result = 0;
      }


      this.api.UniCall(
        {
          CommandText: 'egsQATestRunCasesUpdate',
          Params: [
            {
              Param: '@Result_ID',
              Value: id.toString()
            },
            {
              Param: '@Case_Result',
              Value: '0'
            },
            {
              Param: '@Date_Ended',
              Value: currentDateTime
            }
          ]
        }
      ).subscribe({

        error: (e) => console.error(e),
        complete: () => {
          this.updateProgress()
        }
      });
    }
  }

  changeCaseResult(result?: number) {
    let currentDateTime = new Date();
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
            Value: result?.toString() || this.Case_Result.toString()
          },
          {
            Param: '@Case_Comment',
            Value: this.Case_Comment
          },
          {
            Param: '@Date_Ended',
            Value: currentDateTime
          }
        ]
      }
    ).subscribe({

      error: (e) => console.error(e),
      complete: () => {
      }
    });
    var tempString = "";
    var tempNumber = 0;
    if (result == 1 && this.testrunStat.hasOwnProperty('Passed')) {
      tempString = "@Passed"
      tempNumber = this.testrunStat.find((n: any) => n.User_ID === this.currentCase.User_ID).Passed
    } else if (result == 1) {
      tempString = "@Passed"
      tempNumber = 0;
    }
    if (Number(this.Case_Result) == 2 && this.testrunStat.hasOwnProperty('Failed')) {
      tempString = "@Failed"
      tempNumber = this.testrunStat.find((n: any) => n.User_ID === this.currentCase.User_ID).Failed
    } else if (Number(this.Case_Result) == 2) {
      tempString = "@Failed"
      tempNumber = 0;
    }
    if (Number(this.Case_Result) == 3 && this.testrunStat.hasOwnProperty('Blocked')) {
      tempString = "@Blocked"
      tempNumber = this.testrunStat.find((n: any) => n.User_ID === this.currentCase.User_ID).Blocked
    } else if (Number(this.Case_Result) == 3) {
      tempString = "@Blocked"
      tempNumber = 0;
    }
    if (Number(this.Case_Result) == 4 && this.testrunStat.hasOwnProperty('Invalid')) {
      tempString = "@Invalid"
      tempNumber = this.testrunStat.find((n: any) => n.User_ID === this.currentCase.User_ID).Invalid
    } else if (Number(this.Case_Result) == 4) {
      tempString = "@Invalid"
      tempNumber = 0;
    }
    if (result == 5 && this.testrunStat.hasOwnProperty('Skipped')) {
      tempString = "@Skipped"
      tempNumber = this.testrunStat.find((n: any) => n.User_ID === this.currentCase.User_ID).Skipped
    } else if (result == 5) {
      tempString = "@Skipped"
      tempNumber = 0;
    }
    tempNumber += 1;
    console.log(tempNumber)
    console.log(tempString)
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunStatInsertUpdate',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          },
          {
            Param: '@User_ID',
            Value: this.currentCase.User_ID.toString()
          },
          {
            Param: tempString,
            Value: tempNumber.toString()
          }
        ]
      }
    ).subscribe({

      error: (e) => console.error(e),
      // complete: () => {
      //   this.updateProgress()
      // }
    });
  }

  updateProgress() {
    console.log(this.TestRun_ID);
    console.log(this.testcases.filter((n: any) => n.Case_Result === 2));
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
            Value: this.testcases.filter((n: any) => n.Case_Result === 1).length.toString()
          },
          {
            Param: '@TestRun_Failed',
            Value: this.testcases.filter((n: any) => n.Case_Result === 2).length.toString()
          },
          {
            Param: '@TestRun_Blocked',
            Value: this.testcases.filter((n: any) => n.Case_Result === 3).length.toString()
          },
          {
            Param: '@TestRun_Invalid',
            Value: this.testcases.filter((n: any) => n.Case_Result === 4).length.toString()
          },
          {
            Param: '@TestRun_Skipped',
            Value: this.testcases.filter((n: any) => n.Case_Result === 5).length.toString()
          },
          {
            Param: '@TestRun_Untested',
            Value: this.testcases.filter((n: any) => n.Case_Result === 0).length.toString()
          },
          {
            Param: '@TestRun_CaseCount',
            Value: this.testcases.length.toString()
          },
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()

    });
  }

  openCasePanel(row: testCase) {
    this.caseResultPanel.nativeElement.style.display = "flex";
    this.closeCaseRunPanel();
  }
  getCurrentSuite(id: number) {
    return this.suites.find(n => n.Suite_ID === id);
  }
  closeCasePanel() {
    this.caseResultPanel.nativeElement.style.display = "none";
  }
  openCaseRunPanel(row: testCase) {

    this.currentCase = row;
    this.currentSuite = this.getCurrentSuite(row.Suite_ID);
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunStepsGet',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          },
          {
            Param: '@Case_ID',
            Value: row.Case_ID.toString()
          }
        ],
      }
    ).subscribe(value => {
      if (!value[0]) {
        this.steps = []
        return
      }
      this.steps = value[0];
      console.log(this.steps)
    });

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
      let currentDateTime = new Date();
      this.api.UniCall(
        {
          CommandText: 'egsQATestRunCasesUpdate',
          Params: [
            {
              Param: '@TestRun_ID',
              Value: this.TestRun_ID.toString()
            },
            {
              Param: '@User_ID',
              Value: this.TemporaryUser_ID.toString()
            },
            {
              Param: '@Case_ID',
              Value: this.Case_ID.toString()
            },
            {
              Param: '@Date_Started',
              Value: currentDateTime
            }
          ]
        }
      ).subscribe();

      this.api.UniCall(
        {
          CommandText: 'egsQATestRunStatInsertUpdate',
          Params: [
            {
              Param: '@TestRun_ID',
              Value: this.TestRun_ID.toString()
            },
            {
              Param: '@User_ID',
              Value: this.TemporaryUser_ID.toString()
            },
            {
              Param: '@Date_Started',
              Value: currentDateTime
            }
          ]
        }
      ).subscribe({
        next: (e) => {
        }
      });
      this.closeCasePanel();
    }
  }

  closeCaseRunPanel() {
    this.caseRunPanel.nativeElement.style.display = "none";
  }

  formatDate(date: string) {
    return date.substring(0, 10) + ' ' + date.substring(11, 21);
  }

  getCompleted() {
    var num = ((this.testcases.length - this.testcases.filter((n: any) => n.Case_Result <= 0).length) / this.testcases.length) * 100;
    this.Completed = +parseFloat(num.toString()).toFixed(0);
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
          data: [
            this.testcases.filter((n: any) => n.Case_Result === 1).length,
            this.testcases.filter((n: any) => n.Case_Result === 2).length,
            this.testcases.filter((n: any) => n.Case_Result === 3).length,
            this.testcases.filter((n: any) => n.Case_Result === 4).length,
            this.testcases.filter((n: any) => n.Case_Result === 5).length,
            this.testcases.filter((n: any) => n.Case_Result <= 0).length
          ],
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

  updateResult(result: number, step: any) {
    var index = this.steps.indexOf(step);
    this.steps[index].Step_Result = result;
    this.stepResultInsertUpdate(this.steps[index]);
    if (result == 2) {
      this.Case_Result = result.toString();
      // this.changeCaseResult()
    }
    console.log(step);

  }
  stepResultInsertUpdate(step: any) {

    this.api.UniCall(
      {
        CommandText: 'egsQATestRunSteps',
        Params: [
          {
            Param: '@Result_ID',
            Value: step.Result_ID.toString() || null
          },
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          },
          {
            Param: '@Step_ID',
            Value: step.Case_StepID.toString()
          },
          {
            Param: '@Step_Result',
            Value: step.Step_Result.toString()
          },
          {
            Param: '@Step_Comment',
            Value: step.Step_Comment.toString() || null
          }
        ]
      }
    ).subscribe({
      next: (e) => {
        if (e[0]) {
          var index = this.steps.indexOf(step);
          this.steps[index].Result_ID = e[0][0].Result_ID;
        }
      },
      error: (e) => console.error(e)
    });
  }
  threedots(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  assignUser(Result_ID: number, User_ID: any) {
    this.Case_Assignee = User_ID;
    this.Result_ID = Result_ID;
  }

  confirmUser() {
    if (this.Result_ID != null && this.Case_Assignee != null)
      this.api.UniCall(
        {
          CommandText: 'egsQATestRunCasesUpdate',
          Params: [
            {
              Param: '@Result_ID',
              Value: this.Result_ID.toString()
            },
            {
              Param: '@AddAssign',
              Value: '1'
            },
            {
              Param: '@User_ID',
              Value: this.Case_Assignee.toString()
            }
          ]
        }
      ).subscribe({
        error: (e) => console.error(e),
        complete: () => reloadPage()
      });
  }

  updateInsertDefect(title: string, userid: any, milestone: any, severity: any) {
    console.log(title)
    console.log(userid)
    console.log(milestone)
    console.log(severity)
    let currentDateTime = new Date();
    this.api.UniCall(
      {
        CommandText: 'egsQADefectInsertUpdate',
        Params: [
          {
            Param: '@Defect_ID',
            Value: null
          },
          {
            Param: '@Defect_Title',
            Value: title
          },
          {
            Param: '@Defect_Milestone',
            Value: milestone.toString()
          },
          {
            Param: '@Defect_Severity',
            Value: severity.toString()
          },
          {
            Param: '@Defect_Assignee',
            Value: userid.toString()
          },
          {
            Param: '@Defect_Author',
            Value: this.TemporaryUser_ID.toString()
          },
          {
            Param: '@Defect_Status',
            Value: '1'
          },
          {
            Param: '@Defect_DateCreated',
            Value: currentDateTime
          },
          {
            Param: '@Case_ID',
            Value: this.currentCase.Case_ID.toString()
          },
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

}

