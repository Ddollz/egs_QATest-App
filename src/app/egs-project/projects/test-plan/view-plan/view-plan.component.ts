import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { testplan, testCase, suite, step, testrun, defect } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { reloadPage } from '../../../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';
import { KeyValue } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css']
})
export class ViewPlanComponent implements OnInit {

  //toolbar
  editorOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  // Panel 
  htmlstring: any;
  index: number = 0;
  case_Desc: string = '';
  case_Name: string = '';
  case_PreCon: string = '';
  case_PostCon: string = '';
  testCaseFinal: any;

  //Case Description Variables
  testCaseAttachment: any = [];

  //testCaseComment
  caseComments: any = [];

  // Suite
  Suite_TempUserID: number = 1; //! This is only temporary change/remove this when token/auth is on

  // Utilities
  Case_Severity: string = '';
  Case_Priority: string = '';
  Case_Type: string = '';
  Case_Layer: string = '';
  Case_Flaky: string = '';
  Case_Milestone: string = '';
  Case_Behavior: string = '';
  Case_AutoStat: string = '';
  Case_Result: string = '';

  Project_ID: number = 0;
  Completed: number = 0;

  public chart: any;

  testCase_History: any = [];
  testCase_HistoryAttachment: any = [];
  displayHistoryData: any = []
  displayHistoryDataNumber: number = 5;
  displayHistoryDataAttachment: any = []
  displayHistoryDataAttachmentNumber: number = 5;
  istestCase_HistoryNull: boolean = false;
  istestCase_HistoryAttachmentNull: boolean = false;

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';
  TestPlan_RunTime: string = '';
  Case_ID: string = '';

  //?Assigning User
  Result_ID?: number;
  Case_Assignee?: number;
  //?Assigning User
  
  // Project Modals
  steps: step[] = [];
  testplan: testplan[] = [];
  testCases: testCase[] = [];
  testruns: testrun[] = [];
  suites: suite[] = [];

  // Test cases table
  casesColumns: string[] = ['Title', 'Assignee', 'TimeSpent'];
  casesDataSource = new MatTableDataSource<testCase>();
  finalCaseDataSource: any = {};

  // Steps table
  displayedColumns: string[] = ['Step', 'Action', 'Input', 'Expected'];
  stepdataSource = new MatTableDataSource<step>();
  stepAttachments: any = [];
  stepHistory: any = [];
  stepHistoryDisplay: any = [];
  stepHistoryLimit: number = 5;
  isstepHistoryNull: boolean = false;

  // Defects table
  defectsDisplayedColumns: string[] = ['Defect', 'Author', 'Assignee', 'Severity', 'Milestone', 'External', 'ThreeDots'];
  defectsDataSource = new MatTableDataSource<defect>();

  //Table test runs
  runDisplayedColumns: string[] = ['title', 'environment', 'time', 'status'];
  runDataSource = new MatTableDataSource<testrun>();
  viewRunDisplayedColumns: string[] = ['Status', 'Title', 'Author', 'Time', 'Progress', 'ThreeDots'];
  viewRunDataSource = new MatTableDataSource<testrun>();

  @ViewChild('casePanel') casePanel!: ElementRef;
  // @ViewChild('caseRunPanel') caseRunPanel!: ElementRef;

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
      console.log(this.testCases)
    });

    this.Project_ID = Number(localStorage.getItem('currentProjectID'));

    this.getCase();
   }

   
  ngOnInit(): void {
    this.getTestRun();
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
    // console.log(this.TestPlan_ID)
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

  openCasePanel(event: Event, testc: testCase) {
    this.casePanel.nativeElement.style.display = "flex";
    this.case_Name = testc.Case_Title
    this.case_Desc = testc.Case_Desc
    this.case_PreCon = testc.Case_PreCondition
    this.case_PostCon = testc.Case_PostCondition
    this.testCaseFinal = testc;
    console.log(this.testCaseFinal)

    this.displayHistoryDataNumber = 5;
    this.displayHistoryData = [];
    this.stepHistoryDisplay = [];
    this.stepHistoryLimit = 5;
    // console.log(testc)
    // alert(testc)
    // alert(testp_title)
    // alert(caseName)

    this.api.UniCall(
      {
        CommandText: 'egsQAStepGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: this.testCaseFinal.Case_ID.toString()
          }
        ],
      }
    ).subscribe(value => {
      if (!value[0]) {
        this.steps = []
        this.stepdataSource = new MatTableDataSource<step>(this.steps);
        return
      }
      this.steps = value[0];
      this.stepdataSource = new MatTableDataSource<step>(this.steps);
      let StepId_list: any = [];

      for (let index = 0; index < this.steps.length; index++) {
        let tmp = this.steps[index].Case_StepID.toString();
        if (tmp == undefined || tmp == '') {
          continue;
        }
        else {
          StepId_list = StepId_list.concat(JSON.parse(tmp));
        }
      }
      var Params =
        [
          {
            Param: "@Step_IDList",
            Value: JSON.stringify(StepId_list)
          }

        ];

      var formData = new FormData();
      formData.append("CommandText", 'egsQAAttachmentGet');
      formData.append("Params", JSON.stringify(Params));

      //? API CALL
      this.api.UniAttachmentlist(formData).subscribe({
        next: (result) => {
          if (result != undefined || result.length != 0) {
            this.stepAttachments = result[0];
          } else {
            this.stepAttachments = [];
          }
        },
        error: (msg) => {
          console.log(msg);
          alert("500 Internal Server Errors")
        }
      })

    });

     //? Get TEST CASE Attachments
    //? START
    var commandText = 'egsQAAttachmentGet';
    var Params =
      [

        {
          Param: "@Case_ID",
          Value: this.testCaseFinal.Case_ID.toString()
        }

      ];

    var stringParam = JSON.stringify(Params);

    var formData = new FormData();
    formData.append("CommandText", commandText);
    formData.append("Params", stringParam);

    this.api.UniAttachmentlist(formData).subscribe({
      next: (result) => {
        if (result[0] == undefined)
          this.testCaseAttachment = [];
        else
          this.testCaseAttachment = result[0];
      },
      error: (msg) => {
        console.log(msg);
        alert("500 Internal Server Errors")
      }
    });
    //? END

    // Get Defects
    this.api.UniCall(
      {
        CommandText: 'egsQADefectGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: this.testCaseFinal.Case_ID.toString()
          }
        ],
      }
    ).subscribe(value => {
      // this.defectsDataSource = value[0];
      // console.log(value)
      this.defectsDataSource = new MatTableDataSource<defect>(value[0]);
    }
    );

    //? Get Case Comment
    //? START
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseCommentGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: this.testCaseFinal.Case_ID.toString()
          }
        ],
      }
    ).subscribe(
      {
        next: (v) => {
          this.caseComments = v[0];
          // console.log(v[0])
        },
        error: (e) => console.error(e),
      }
    )
    //? END

    //? Get History
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseHistoryGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: this.testCaseFinal.Case_ID.toString()
          }
        ],
      }
    ).subscribe(value => {
      if (value.length === 0) {
        this.istestCase_HistoryNull = true;
        this.testCase_History = [];

        //? START STEP HISTORY
        this.api.UniCall(
          {
            CommandText: 'egsQAStepHistoryGet',
            Params: [
              {
                Param: '@Case_ID',
                Value: this.testCaseFinal.Case_ID.toString()
              }
            ],
          }
        ).subscribe(
          {
            next: (v) => {
              console.log(this.stepHistoryDisplay);

              if (v.length === 0) {
                this.isstepHistoryNull = true;
                this.stepHistory = [];
              }
              else {
                this.isstepHistoryNull = false;
                this.stepHistory = v[0]
                this.stepHistoryDisplay = this.stepHistory.slice(0, this.stepHistoryLimit);
              }
            },
            error: (e) => console.error(e),
          }
        )
        //? END

      }
      else {
        this.istestCase_HistoryNull = false;

        this.testCase_History = value[0];
        this.displayHistoryData = this.testCase_History.slice(0, this.displayHistoryDataNumber);
        var Params =
          [

            {
              Param: '@Case_ID',
              Value: this.testCaseFinal.Case_ID.toString()
            }

          ];

        var formData = new FormData();
        formData.append("CommandText", 'egsAttachmentMasterHistoryGet');
        formData.append("Params", JSON.stringify(Params));

        //? API CALL
        this.api.UniAttachmentlist(formData).subscribe({
          next: (value) => {

            if (value.length === 0) {
              this.istestCase_HistoryAttachmentNull = true;
              this.testCase_HistoryAttachment = [];
            }
            else {
              this.istestCase_HistoryAttachmentNull = false;
              this.testCase_HistoryAttachment = value[0]
            }
          },
          error: (msg) => {
            console.log(msg);
            alert("500 Internal Server Errors")
          }
        })


      }

    });

    // END of Open case panel
  }

  showMoreHistory(value: string) {
    if (value == '1') {
      this.displayHistoryDataNumber = this.displayHistoryDataNumber + 3;
      if (this.displayHistoryDataNumber > this.testCase_History.length) {
        this.displayHistoryDataNumber = this.testCase_History.length
      }
      this.displayHistoryData = this.testCase_History.slice(0, this.displayHistoryDataNumber);
    }
    if (value == '2') {

      this.displayHistoryDataAttachmentNumber = this.displayHistoryDataAttachmentNumber + 3;
      if (this.displayHistoryDataAttachmentNumber > this.testCase_HistoryAttachment.length) {
        this.displayHistoryDataAttachmentNumber = this.testCase_HistoryAttachment.length
      }
      this.displayHistoryDataAttachment = this.testCase_HistoryAttachment.slice(0, this.displayHistoryDataAttachmentNumber);
    }
    if (value == '3') {

      this.stepHistoryLimit = this.stepHistoryLimit + 3;
      if (this.stepHistoryLimit > this.stepHistory.length) {
        this.stepHistoryLimit = this.stepHistory.length
      }
      this.stepHistoryDisplay = this.stepHistory.slice(0, this.stepHistoryLimit);
      console.log(this.stepHistoryDisplay)

    }
  }

  closeCasePanel() {
      this.casePanel.nativeElement.style.display = "none";
  }

  // openCaseRunPanel() {
  //   this.caseRunPanel.nativeElement.style.display = "flex";
  //   this.closeCasePanel();
  // }

  // closeCaseRunPanel() {
  //   this.caseRunPanel.nativeElement.style.display = "none";
  // }

  onChangePanel(parameter: string, newValue: any) {
    if (parameter.substring(1) == "Case_Severity")
      this.testCaseFinal.Case_Severity = Number(newValue);
    if (parameter.substring(1) == "Case_Priority")
      this.testCaseFinal.Case_Priority = Number(newValue);
    if (parameter.substring(1) == "Case_Type")
      this.testCaseFinal.Case_Type = newValue;
    if (parameter.substring(1) == "Case_Flaky")
      this.testCaseFinal.Case_Flaky = Number(newValue);
    if (parameter.substring(1) == "Case_Milestone")
      this.testCaseFinal.Case_Milestone = Number(newValue);
    if (parameter.substring(1) == "Case_Behavior")
      this.testCaseFinal.Case_Behavior = Number(newValue);
    if (parameter.substring(1) == "Case_AutoStat")
      this.testCaseFinal.Case_AutoStat = Number(newValue);

    console.log(this.testCaseFinal)
    //? START
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseInsertUpdate',
        Params: [
          {
            Param: '@Case_IDED',
            Value: this.testCaseFinal.Case_ID.toString()
          },
          {
            Param: parameter,
            Value: newValue.toString()
          }
        ],
      }
    ).subscribe(
      {
        next: (v) => {
          console.log(v);
        },
        error: (e) => console.error(e),
      }
    )
    //? END

    // //? Get History
    // this.api.UniCall(
    //   {
    //     CommandText: 'egsQATestCaseHistoryGet',
    //     Params: [
    //       {
    //         Param: '@Case_ID',
    //         Value: this.testCaseFinal.Case_ID.toString()
    //       }
    //     ],
    //   }
    // ).subscribe(value => {
    //   if (value.length === 0)
    //     this.istestCase_HistoryNull = true
    //   this.testCase_History = value[0];
    // });
  }

  //? Function for downloading file
  downloadFile(file_ID: any, filename: string) {

    //? Stored Procedure Name
    var commandText = 'egsQAAttachmentGet';

    //? Parameter of the store procedure
    var Params = [{
      Param: "@attachment_ID",
      Value: file_ID.toString()
    }]

    //? Convert Param JSON to String So may the api able to read json
    var stringParam = JSON.stringify(Params);
    var formData = new FormData();


    //? When we are using UniAttachment we need to use Formdata in angular allowing us
    //? to create, read, update and delete files
    //? When posting file the "isDownload field is required"
    formData.append("CommandText", commandText);
    formData.append("Params", stringParam);
    formData.append("file_ID", file_ID.toString());
    formData.append("isDownload", 'true');

    this.api.UniAttachmentlist(formData, true).subscribe({
      next: (result) => {
        let blob: Blob = result.body as Blob;
        let a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      error: (msg) => {
        console.log(msg);
      }
    })

  }

  SuiteID_List: any = [];
  SuiteName_List: any = [];
  suiteBar_List: any = [];

  getSuite(id: any) {
    console.log(id)
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
      // var idsInArray = id.split(" ").filter((a: any) => a);
      // for (let index = 0; index < idsInArray.length; index++) {
      //   this.getCaseStatus(idsInArray[index]);
      //   var barFilled: any = {};
      //   barFilled['Passed'] = this.getProgress(this.Passed, idsInArray[index])
      //   barFilled['Failed'] = this.getProgress(this.Failed, idsInArray[index])
      //   barFilled['Blocked'] = this.getProgress(this.Blocked, idsInArray[index])
      //   barFilled['Invalid'] = this.getProgress(this.Invalid, idsInArray[index])
      //   barFilled['Skipped'] = this.getProgress(this.Skipped, idsInArray[index])
      //   barFilled['Untested'] = this.getProgress(this.Untested, idsInArray[index])
      //   var Filtereds: any = {};

      //   Filtereds[idsInArray[index]] = barFilled
      //   this.suiteBar_List.push(Filtereds)
      // }
      //? For progressbar per suites

    });
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
        CommandText: 'egsQATestPlanCasesGet',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.index.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.testCases = value[0];
      var temp = '';
      for (let index = 0; index < this.testCases.length; index++) {
        if (this.finalCaseDataSource.hasOwnProperty(this.testCases[index].Suite_ID)) {
          console.log(this.testCases[index].Suite_ID)
          this.finalCaseDataSource[this.testCases[index].Suite_ID].push(this.testCases[index]);
        } else {
          temp = temp + ' ' + this.testCases[index].Suite_ID;
          this.finalCaseDataSource[this.testCases[index].Suite_ID] = [];
          this.finalCaseDataSource[this.testCases[index].Suite_ID].push(this.testCases[index]);
        }
      }
      this.casesDataSource = new MatTableDataSource<testCase>(this.testCases);
      this.getCompleted();
      this.getSuite(temp);
      // this.createChart();

      console.log(this.testCases)
      console.log(temp)

    });
  }

  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return 0;
  }

  threedots(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  assignUser(Result_ID: number, User_ID: any) {
    this.Case_Assignee = User_ID;
    this.Result_ID = Result_ID;
  }

  postComment() {
    let currentDateTime = new Date();
    // console.log(this.htmlstring);
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseCommentInsertUpdate',
        Params: [
          {
            Param: '@Comment_Content',
            Value: this.htmlstring
          },
          {
            Param: '@Comment_Date',
            Value: currentDateTime
          },
          {
            Param: '@User_ID',
            Value: this.Suite_TempUserID.toString()
          },
          {
            Param: '@Case_ID',
            Value: this.testCaseFinal.Case_ID.toString()
            // this.testCase.Case_ID.toString()
          },
        ],
      }
    ).subscribe(
      {
        // next: (v) => console.log(v),
        error: (e) => { console.error(e); alert("500 Internal Server Errors") },
        complete: () => reloadPage()
      }
    )
  }

  commentContent(event: any) {
    this.htmlstring = JSON.stringify(event.content);
  }
  displayCommentContent(event: any, content: any) {
    event.setContents(JSON.parse(content));
  }

  getTestRun() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.testruns = value[0];
      console.log(this.testruns)
      console.log(this.Project_ID)
      this.viewRunDataSource = new MatTableDataSource<testrun>(this.testruns);
    });
  }

  formatDate(date: string) {
    return date.substring(0, 10) + ' ' + date.substring(11, 21);
  }

  getCompleted() {
    var num = ((this.testCases.length - this.testCases.filter((n: any) => n.Case_Result <= 0).length) / this.testCases.length) * 100;
    this.Completed = +parseFloat(num.toString()).toFixed(0);
  }

  // createChart() {
  //   this.chart = new Chart("chart", {
  //     type: 'doughnut',
  //     options: {
  //       plugins: {
  //         legend: {
  //           display: false
  //         }
  //       }
  //     },
  //     data: {
  //       labels: [
  //         'Passed',
  //         'Failed',
  //         'Blocked',
  //         'Invalid',
  //         'Skipped',
  //         'Untested',
  //       ],
  //       datasets: [{
  //         data: [
  //           this.testCases.filter((n: any) => n.Case_Result === 1).length,
  //           this.testCases.filter((n: any) => n.Case_Result === 2).length,
  //           this.testCases.filter((n: any) => n.Case_Result === 3).length,
  //           this.testCases.filter((n: any) => n.Case_Result === 4).length,
  //           this.testCases.filter((n: any) => n.Case_Result === 5).length,
  //           this.testCases.filter((n: any) => n.Case_Result <= 0).length
  //         ],
  //         backgroundColor: [
  //           '#94c64a',
  //           '#f66384',
  //           'rgb(221, 181, 10)',
  //           'rgb(95, 1, 185)',
  //           'rgb(175, 175, 175)',
  //           '#c1c1c1'
  //         ]
  //       }]
  //     }
  //   });
  // }

}
