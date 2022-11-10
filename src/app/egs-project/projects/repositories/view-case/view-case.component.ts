import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { defect, step, testCase } from 'src/app/models/project/project.model';
import { ApiService } from 'src/app/services/api.service';
import { reloadPage, sidebarService } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-view-case',
  templateUrl: './view-case.component.html',
  styleUrls: ['./view-case.component.css']
})
export class ViewCaseComponent implements OnInit {
  temporaryUser: Number = 3; //!Karl User Account in database This is Temporary
  Project_ID: Number = 0;

  case_id: number = 0
  testCase = {} as testCase;
  testCaseAttachment: any = [];
  steps: step[] = [];
  stepAttachments: any = [];

  stepdisplayedColumns: string[] = ['Step', 'Action', 'Input', 'Expected'];
  stepdataSource = new MatTableDataSource<step>();
  stepHistory: any = [];
  stepHistoryDisplay: any = [];
  stepHistoryLimit: number = 5;
  isstepHistoryNull: boolean = false;


  testCase_History: any = [];
  testCase_HistoryAttachment: any = [];
  istestCase_HistoryNull: boolean = false;
  istestCase_HistoryAttachmentNull: boolean = false;

  displayHistoryData: any = []
  displayHistoryDataNumber: number = 5;
  displayHistoryDataAttachment: any = []
  displayHistoryDataAttachmentNumber: number = 5;

  //Table test defects
  defectsDisplayedColumns: string[] = ['ID', 'Defect', 'Author', 'Assignee', 'Status'];
  defectsDataSource = new MatTableDataSource<defect>();
  defects: defect[] = [];

  @ViewChild('contenthead') panelNav?: ElementRef;
  @ViewChild('content_container') panelContent?: ElementRef;
  @ViewChild('General') General?: ElementRef;
  @ViewChild('historyhead') panelNavsub?: ElementRef;
  @ViewChild('subpanelContent') subpanelContent?: ElementRef;
  @ViewChild('Descriptions') Descriptions?: ElementRef;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private sidebarServ: sidebarService) {
    this.Project_ID = Number(this.activatedRoute.snapshot.paramMap.get('id')); //? 4
    this.Project_ID = this.sidebarServ.projectID;
    this.case_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    console.log(this.case_id)
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: this.case_id.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.testCase = value[0][0];

      //? Get TEST CASE Attachments
      //? START
      var commandText = 'egsQAAttachmentGet';
      var Params =
        [

          {
            Param: "@Case_ID",
            Value: this.testCase.Case_ID.toString()
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

      console.log("he")
      this.changePanelContent('General');
      this.changeSubPanelContent('Descriptions');
      this.api.UniCall(
        {
          CommandText: 'egsQAStepGet',
          Params: [
            {
              Param: '@Case_ID',
              Value: this.testCase.Case_ID.toString()
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

        //? Get History
        this.api.UniCall(
          {
            CommandText: 'egsQATestCaseHistoryGet',
            Params: [
              {
                Param: '@Case_ID',
                Value: this.testCase.Case_ID.toString()
              }
            ],
          }
        ).subscribe(
          {
            next: (e) => {
              console.log(value)
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
                        Value: this.testCase.Case_ID.toString()
                      }
                    ],
                  }
                ).subscribe(
                  {
                    next: (v) => {
                      console.log(v)
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
                      Value: this.testCase.Case_ID.toString()
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


                //? START STEP HISTORY
                this.api.UniCall(
                  {
                    CommandText: 'egsQAStepHistoryGet',
                    Params: [
                      {
                        Param: '@Case_ID',
                        Value: this.testCase.Case_ID.toString()
                      }
                    ],
                  }
                ).subscribe(
                  {
                    next: (v) => {
                      console.log(v)
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

            },
            error: (e) => { console.log(e) },
            complete: () => {

            }
          });
      }
      );

      this.api.UniCall(
        {
          CommandText: 'egsQADefectGet',
          Params: [
            {
              Param: '@WithAll',
              Value: 'true'
            },
            {
              Param: '@Case_ID',
              Value: this.testCase.Case_ID.toString()
            }
          ]
        }
      ).subscribe(value => {
        console.log(value)
        this.defects = value[0];
        this.defectsDataSource = new MatTableDataSource<defect>(this.defects);
      });
    }
    );




  }

  ngOnInit(): void {

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


  changePanelContent(value: string) {
    let panelNavchildren = this.panelNav?.nativeElement.children;
    let activePanel = this.panelNav?.nativeElement.querySelector('#' + value);

    let panelContentchildren = this.panelContent?.nativeElement.children;
    let activeContent = this.panelContent?.nativeElement.querySelector('#' + value);

    for (let index = 0; index < panelNavchildren.length; index++) {

      panelNavchildren[index].classList.remove('active');

    }

    activePanel.classList.add('active');

    for (let index = 0; index < panelContentchildren.length; index++) {

      panelContentchildren[index].style.display = 'none';
    }
    if (value === 'History')
      activeContent.style.display = 'flex';
    else
      activeContent.style.display = 'block';

  }

  onChangePanel(parameter: string, newValue: any) {
    if (parameter.substring(1) == "Case_Severity")
      this.testCase.Case_Severity = Number(newValue);
    if (parameter.substring(1) == "Case_Priority")
      this.testCase.Case_Priority = Number(newValue);
    if (parameter.substring(1) == "Case_Type")
      this.testCase.Case_Type = newValue;
    if (parameter.substring(1) == "Case_Flaky")
      this.testCase.Case_Flaky = Number(newValue);
    if (parameter.substring(1) == "Case_Milestone")
      this.testCase.Case_Milestone = Number(newValue);
    if (parameter.substring(1) == "Case_Behavior")
      this.testCase.Case_Behavior = Number(newValue);
    if (parameter.substring(1) == "Case_AutoStat")
      this.testCase.Case_AutoStat = Number(newValue);

    console.log(this.testCase)
    //? START
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseInsertUpdate',
        Params: [
          {
            Param: '@Case_IDED',
            Value: this.testCase.Case_ID.toString()
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

    //? Get History
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseHistoryGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: this.testCase.Case_ID.toString()
          }
        ],
      }
    ).subscribe(value => {
      if (value.length === 0)
        this.istestCase_HistoryNull = true
      this.testCase_History = value[0];
    });
  }


  changeSubPanelContent(value: string) {
    let panelNavchildren = this.panelNavsub?.nativeElement.children;
    let activePanel = this.panelNavsub?.nativeElement.querySelector('#' + value);

    let panelContentchildren = this.subpanelContent?.nativeElement.children;
    let activeContent = this.panelContent?.nativeElement.querySelector('#' + value + '-sub');
    for (let index = 0; index < panelNavchildren.length; index++) {

      panelNavchildren[index].classList.remove('active');

    }

    activePanel.classList.add('active');

    for (let index = 0; index < panelContentchildren.length; index++) {

      panelContentchildren[index].style.display = 'none';
    };
    activeContent.style.display = 'flex';
  }
  deleteCase(value: number) {
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseDelete',
        Params: [
          {
            Param: '@Case_ID',
            Value: value.toString()
          }, {
            Param: '@LastModifiedUser',
            Value: this.temporaryUser.toString()
          }
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
}
