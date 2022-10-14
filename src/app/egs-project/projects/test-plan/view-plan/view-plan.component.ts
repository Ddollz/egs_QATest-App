import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { testplan, testCase, suite, step, testrun, defect } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { reloadPage } from '../../../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';

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

  Case_Severity: string = '';
  Case_Priority: string = '';
  Case_Type: string = '';
  Case_Layer: string = '';
  Case_Flaky: string = '';
  Case_Milestone: string = '';
  Case_Behavior: string = '';
  Case_AutoStat: string = '';

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';
  TestPlan_RunTime: string = '';
  Case_ID: string = '';
  
  // Project Modals
  steps: step[] = [];
  testplan: testplan[] = [];
  testCases: testCase[] = [];

  // Test cases table
  casesColumns: string[] = ['Title', 'Assignee', 'Expected_Duration'];
  casesDataSource = new MatTableDataSource<testCase>();

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

  @ViewChild('casePanel') casePanel!: ElementRef;
  // @ViewChild('caseRunPanel') caseRunPanel!: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.getTestPlan();
    }
    // console.log(this.index.toString())

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
      // console.log(this.casesDataSource.filteredData)
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


}
