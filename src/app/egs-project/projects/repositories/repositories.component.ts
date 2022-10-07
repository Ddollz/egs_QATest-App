import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { project, suite, testCase, step, testrun, defect } from '../../../models/project/project.model';
import { reloadPage, sidebarService } from '../../../services/global-functions.service';
import { BehaviorSubject, find, Observable } from 'rxjs';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit, AfterViewInit {
  temporaryUser: Number = 3; //!Karl User Account in database This is Temporary
  //toolbar
  editorOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['link', 'image', 'video']                         // link and image, video
    ]
  };
  htmlstring: any;

  //testCaseComment
  caseComments: any = [];

  //Utilities
  LinkParamID: number = 0;
  suitesDeleteArray: string = '';
  carretOpen: boolean = true;
  currentDate = new Date();

  //Modal
  Modal_Title: string = "Create suite";
  Modal_btn: string = "Create";


  //Modal Delete
  @ViewChild('openDeleteSuiteModal') deleteSuiteButton?: ElementRef;
  dataTypeDelete: string = "Suite";
  dataTitleDelete: string = "N/a";
  countSuiteChild: number = 0;
  numberOfCasesDelete: number = 0;
  currentSuiteDelete: any;
  preventDeleteSuiteParent: any = 'delete';

  //Selection Suite
  // preventDeleteSuiteID: any = [];
  preventSuiteID: any = [];

  //Project Modals
  suites: suite[] = [];
  testCases: testCase[] = [];
  @Input() project = {} as project;
  steps: step[] = [];

  //Table Steps
  displayedColumns: string[] = ['Step', 'Action', 'Input', 'Expected'];
  stepdataSource = new MatTableDataSource<step>();
  stepAttachments: any = [];
  stepHistory: any = [];
  stepHistoryDisplay: any = [];
  stepHistoryLimit: number = 5;
  isstepHistoryNull: boolean = false;


  //Table test runs
  runDisplayedColumns: string[] = ['title', 'environment', 'time', 'status'];
  runDataSource = new MatTableDataSource<testrun>();

  //Table test defects
  defectsDisplayedColumns: string[] = ['Defect', 'Author', 'Assignee', 'Severity', 'Milestone', 'External', 'ThreeDots'];
  defectsDataSource = new MatTableDataSource<defect>();

  //Case Description Variables
  testCaseID: number = 0;
  testCase = {} as testCase;
  testCaseAttachment: any = [];
  @ViewChild('panelNav') panelNav?: ElementRef;
  @ViewChild('panelContent') panelContent?: ElementRef;
  @ViewChild('casePanel') panel?: ElementRef;
  @ViewChild('General') General?: ElementRef;

  @ViewChild('panelNavsub') panelNavsub?: ElementRef;
  @ViewChild('subpanelContent') subpanelContent?: ElementRef;
  @ViewChild('Descriptions') Descriptions?: ElementRef;

  Case_Severity: string = '';
  Case_Priority: string = '';
  Case_Type: string = '';
  Case_Layer: string = '';
  Case_Flaky: string = '';
  Case_Milestone: string = '';
  Case_Behavior: string = '';
  Case_AutoStat: string = '';
  testCase_History: any = [];
  testCase_HistoryAttachment: any = [];
  displayHistoryData: any = []
  displayHistoryDataNumber: number = 5;
  displayHistoryDataAttachment: any = []
  displayHistoryDataAttachmentNumber: number = 5;
  istestCase_HistoryNull: boolean = false;
  istestCase_HistoryAttachmentNull: boolean = false;
  theEnd = false;
  offset = new BehaviorSubject(null);
  infinite?: Observable<any[]>;

  Suite_ID: number = 0;
  Suite_Name: string = '';
  Suite_Root: string = 'ProjectRoot|' + this.project.Project_ID;
  Parent_SuiteID: string = '';
  Description: string = '';
  Preconditions: string = '';
  Suite_isLock: number = 0;
  Suite_TempUserID: number = 1; //! This is only temporary change/remove this when token/auth is on

  // Selection variables
  confirmString: string = '';
  allowBoolSelected: boolean = false;
  SelectedTestCase: string = '';
  SelectedTestCaseCount: number = 0;
  SelectedSuite: string = '';
  SelectedSuiteCount: number = 0;
  suiteModel = new SelectionModel(
    true,   // multiple selection or not
  );

  testCaseModel = new SelectionModel(
    true,   // multiple selection or not
  );

  selectedSuiteCheck(event: number, bool: boolean = false) {
    if (bool) return this.suiteModel.deselect(event)
    this.suiteModel.toggle(event)
    if (this.suiteModel.isSelected(event)) {
      let tempCases = this.testCases.filter(x => x.Suite_ID === event);
      for (let index = 0; index < tempCases.length; index++) {
        this.testCaseModel.select(tempCases[index].Case_ID)
      }
    } else {
      let tempCases = this.testCases.filter(x => x.Suite_ID === event);
      for (let index = 0; index < tempCases.length; index++) {
        this.testCaseModel.deselect(tempCases[index].Case_ID)
      }
    }
  }

  selectedTestCaseCheck(event: number, sD: number) {
    this.testCaseModel.toggle(event)
    var child = this.testCases.filter(x => x.Suite_ID === sD);
    if (child.length == this.testCaseModel.selected.length) {
      this.selectedSuiteCheck(sD);
    } else {
      this.selectedSuiteCheck(sD, true);
    }
  }
  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private sidebarServ: sidebarService) {

    this.LinkParamID = Number(this.activatedRoute.snapshot.paramMap.get('id')); //? 4
    // this.sidebarServ.fetchProjectID(this.LinkParamID);

    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.LinkParamID.toString() //Project ID = 4
          }
        ],
      }
    ).subscribe(value => {
      this.suites = value[0];

      //Dropdown
      if (this.suites) {
        this.Suite_Root = 'ProjectRoot|' + this.project.Project_ID;
        for (let index = 0; index < this.suites.length; index++) {
          this.suites[index]['carretOpen'] = true;
        }

        this.api.UniCall(
          {
            CommandText: 'egsQATestCaseGet',
            Params: [
              {
                Param: '@Project_ID',
                Value: this.LinkParamID.toString()
              }
            ],
          }
        ).subscribe(value => {
          this.testCases = value[0];
        }
        );
      } else {
        this.suites = []
        this.testCases = [];
      }
      //Dropdown End

    }
    );

    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.LinkParamID.toString() //? 4
          }
        ],
      }
    ).subscribe(value => {
      this.project = value[0][0];
      this.Suite_Root = 'ProjectRoot|' + this.project.Project_ID; //For dropdown value
    }
    );

    //CHECKBOX
    this.suiteModel.changed.subscribe({
      next: (e) => {
        var test = '';
        for (let index = 0; index < e.source.selected.length; index++) {
          test = e.source.selected[index] + ',' + test

        }
        test = test.slice(0, -1) //'abcde'
        this.SelectedSuite = test;
        this.SelectedSuiteCount = this.suiteModel.selected.length;
        console.log(this.SelectedSuite)
      }
    })

    this.testCaseModel.changed.subscribe({
      next: (e) => {
        var test = '';
        for (let index = 0; index < e.source.selected.length; index++) {
          test = e.source.selected[index] + ',' + test
        }
        test = test.slice(0, -1) //'abcde'
        this.SelectedTestCase = test;
        this.SelectedTestCaseCount = this.testCaseModel.selected.length;
        console.log(this.SelectedTestCase)
      }
    })
    //END
  }
  confirmation() {
    if (this.confirmString === "CONFIRM") {
      this.allowBoolSelected = true;
    } else {
      this.allowBoolSelected = false;
    }
  }
  multiDelete() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseMultiDelete',
        Params: [
          {
            Param: '@SuiteList',
            Value: this.SelectedSuite
          },
          {
            Param: '@TestcaseList',
            Value: this.SelectedTestCase
          }, {
            Param: '@LastModifiedUser',
            Value: this.temporaryUser.toString()
          }
        ],
      }
    ).subscribe({
      next: (e) => {
        reloadPage();
      },
      error: (e) => {
        console.log(e)
      }
    });
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {

  }
  collapseAllToggle(bol: boolean) {
    var dom = document.getElementById('list-container');
    if (dom) {
      var domCollapse = dom.getElementsByClassName('collapse');
      if (domCollapse) {
        // console.log(dom);
        for (let index = 0; index < domCollapse.length; index++) {
          // const element = array[index];
          console.log(domCollapse[index])
          if (bol) {
            domCollapse[index].classList.remove('show');

            for (let index = 0; index < this.suites.length; index++) {
              this.suites[index]['carretOpen'] = false;
            }
          }
          if (!bol) {
            domCollapse[index].classList.add('show');

            for (let index = 0; index < this.suites.length; index++) {
              this.suites[index]['carretOpen'] = true;
            }
          }

        }

      }
    }
  }
  toggleDropdown(event: Event, suite: any) {
    var element = event.currentTarget as HTMLElement;
    var dropdownLeft = element.getAttribute('data-bs-target')
    var dropdownRight = element.getAttribute('data-bs-target') + '-case';
    if (dropdownLeft != null && dropdownRight != null) {
      var dropdownDomLeft = document.getElementById(dropdownLeft.toString())
      var dropdownDomRight = document.getElementById(dropdownRight.toString())
      if (dropdownDomLeft?.classList.contains("show")) {
        dropdownDomLeft?.classList.remove("show")
        dropdownDomRight?.classList.remove("show")
      }
      else {
        dropdownDomLeft?.classList.add("show")
        dropdownDomRight?.classList.add("show")
      }

      let index = this.suites.indexOf(suite);
      suite.carretOpen = !suite.carretOpen;
      this.suites[index] = suite;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  onQuickCaseEnter(event: any) {
    var dom = event.currentTarget as HTMLElement;
    var sID = dom.getAttribute('suiteattri')
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseInsertUpdate',
        Params: [
          {
            Param: '@Case_Title',
            Value: event.target.value.toString()
          },
          {
            Param: '@Case_Status',
            Value: '1'
          },
          {
            Param: '@Case_Desc',
            Value: null
          },
          {
            Param: '@Suite_ID',
            Value: sID?.toString()
          },
          {
            Param: '@Case_Severity',
            Value: '1'
          },
          {
            Param: '@Case_Priority',
            Value: '1'
          },
          {
            Param: '@Case_Type',
            Value: 'Other'
          },
          {
            Param: '@Case_Layer',
            Value: '1'
          },
          {
            Param: '@Case_Flaky',
            Value: '1'
          },
          {
            Param: '@Case_isLock',
            Value: '0'
          },
          {
            Param: '@User_ID',
            Value: this.Suite_TempUserID.toString()
          },
          {
            Param: '@Case_Milestone',
            Value: '1'
          },
          {
            Param: '@Case_Behavior',
            Value: '1'
          },
          {
            Param: '@Case_AutoStat',
            Value: '1'
          },
          {
            Param: '@Case_PreCondition',
            Value: null
          },
          {
            Param: '@Case_PostCondition',
            Value: null
          },
          {
            Param: '@Case_Tags',
            Value: '1'
          },
          {
            Param: '@Case_Param',
            Value: null
          }, {
            Param: '@LastModifiedUser',
            Value: this.temporaryUser.toString()
          }, {
            Param: '@Project_ID',
            Value: this.LinkParamID.toString()
          },

        ],
      }
    ).subscribe(
      {
        // next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => reloadPage()
      }
    )
  }

  insertUpdateSuite() {
    var splited = this.Suite_Root.split("|");
    if (splited[0] === 'ProjectRoot') {
      this.Suite_Root = splited[1];
      this.Parent_SuiteID = "";
    } else if ((splited[0] === 'ParentRoot')) {
      this.Parent_SuiteID = splited[1];
      this.Suite_Root = this.LinkParamID.toString();
    }
    // console.log(this.Parent_SuiteID);
    this.api.UniCall(
      {
        CommandText: 'egsQASuiteInsertUpdate',
        Params: [
          {
            Param: '@Suite_ID',
            Value: this.Suite_ID.toString()
          },
          {
            Param: '@Suite_Name',
            Value: this.Suite_Name
          },
          {
            Param: '@Suite_Desc',
            Value: this.Description
          },
          {
            Param: '@Suite_PreCondition',
            Value: this.Preconditions
          },
          {
            Param: '@Suite_isLock',
            Value: this.Suite_isLock.toString()
          },
          {
            Param: '@User_ID',
            Value: this.Suite_TempUserID.toString()
          },
          {
            Param: '@Project_ID',
            Value: this.Suite_Root.toString() || null
          },
          {
            Param: '@Parent_SuiteID',
            Value: this.Parent_SuiteID.toString() || null
          }
        ],
      }
    ).subscribe(
      {
        // next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => reloadPage()
      }
    )
  }
  editSuite(editSuite: number) {
    this.Modal_Title = "Edit suite";
    this.Modal_btn = "Save";
    var currentSuite = this.suites.find(x => x.Suite_ID === editSuite);
    if (currentSuite != null) {
      this.Suite_ID = currentSuite.Suite_ID;
      this.Suite_Name = currentSuite.Suite_Name;
      if (currentSuite.Parent_SuiteID == 0) {
        this.Suite_Root = 'ProjectRoot|' + currentSuite.Project_ID.toString();
      } else {
        this.Suite_Root = 'ParentRoot|' + currentSuite.Parent_SuiteID.toString();
      }
      this.Description = currentSuite.Suite_Desc;
      this.Preconditions = currentSuite.Suite_PreCondition;
      this.Suite_Name = currentSuite.Suite_Name;


      //? Select Suite Delete
      this.preventSuiteID.push(currentSuite.Suite_ID);
      console.log(this.preventSuiteID);
      //? Select/Filter if has a child
      var child = this.suites.filter(x => x.Parent_SuiteID === currentSuite?.Suite_ID);
      this.preventSuiteID.push(child[0].Suite_ID);

      //? If has a chiled loop again and get all child
      if (child.length > 0) {
        for (let index = 0; index < child.length; index++) {
          this.getChildTreeSuiteID(child[index].Suite_ID)
        }
      }
    }
  }

  //? Looping child
  getChildTreeSuiteID(id: number) {
    var child = this.suites.filter(x => x.Parent_SuiteID === id);
    if (child.length > 0) {
      this.preventSuiteID.push(child[0].Suite_ID);
      for (let index = 0; index < child.length; index++) {
        this.getChildTreeSuite(child[index].Suite_ID)
      }
    }
  }

  deleteOnCascade(i: number) {
    var currentSuite = this.suites.find(x => x.Parent_SuiteID === i);
    if (currentSuite != null) {
      if (this.suitesDeleteArray == "")
        this.suitesDeleteArray = currentSuite.Suite_ID.toString();
      else
        this.suitesDeleteArray = this.suitesDeleteArray + ', ' + currentSuite.Suite_ID;
      this.deleteOnCascade(currentSuite.Suite_ID);
    }
    return true
  }
  deleteSuite(suiteID: number) {
    //? Modal Buttom and entities
    this.deleteSuiteButton?.nativeElement.click();
    this.countSuiteChild = 0;
    this.numberOfCasesDelete = 0;
    this.preventSuiteID = [];

    //? Select Suite Delete
    this.currentSuiteDelete = this.suites.find(x => x.Suite_ID === suiteID);
    this.preventSuiteID.push(this.currentSuiteDelete.Suite_ID);

    //? Select/Filter if has a child
    var child = this.suites.filter(x => x.Parent_SuiteID === this.currentSuiteDelete.Suite_ID);

    //? If has a chiled loop again and get all child
    if (child.length > 0) {
      this.preventSuiteID.push(child[0].Suite_ID);

      for (let index = 0; index < child.length; index++) {
        this.getChildTreeSuite(child[index].Suite_ID)
      }
    }

    for (let index = 0; index < this.preventSuiteID.length; index++) {
      if (this.preventSuiteID[index] != suiteID) {
        this.countSuiteChild += 1;
      }
    }

    for (let index = 0; index < this.preventSuiteID.length; index++) {
      let cased = this.testCases.filter(x => x.Suite_ID === this.preventSuiteID[index]);
      this.numberOfCasesDelete = cased.length + this.numberOfCasesDelete;
    }
    //? Modal Change
    if (this.currentSuiteDelete != null) {
      this.dataTitleDelete = this.currentSuiteDelete.Suite_Name
    }

  }
  //? Looping child
  getChildTreeSuite(id: number) {
    var child = this.suites.filter(x => x.Parent_SuiteID === id);
    if (child.length > 0) {
      this.preventSuiteID.push(child[0].Suite_ID);
      for (let index = 0; index < child.length; index++) {
        this.getChildTreeSuite(child[index].Suite_ID)
      }
    }
  }
  createChildSuites(SuiteParentID: any) {
    this.resetModal();
    this.Suite_Root = 'ParentRoot|' + SuiteParentID;
  }

  resetModal() {

    this.Modal_Title = "Create suite";
    this.Modal_btn = "Create";
    this.Suite_ID = 0;
    this.Suite_Name = '';
    this.Suite_Root = 'ProjectRoot|' + this.project.Project_ID;
    this.Parent_SuiteID = '';
    this.Description = '';
    this.Preconditions = '';
  }

  openPanel(event: Event, testc: testCase) {
    this.displayHistoryDataNumber = 5;
    this.displayHistoryData = [];
    this.stepHistoryDisplay = [];
    this.stepHistoryLimit = 5;
    this.changePanelContent('General');
    this.changeSubPanelContent('Descriptions');
    this.api.UniCall(
      {
        CommandText: 'egsQAStepGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: testc.Case_ID.toString()
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

    }
    );
    var caseRow = event.currentTarget as HTMLElement;
    caseRow.focus();
    this.testCase = testc;
    if (this.panel != null)
      this.panel.nativeElement.style.display = "flex";

    this.Case_Severity = this.testCase.Case_Severity.toString();
    this.Case_Priority = this.testCase.Case_Priority.toString();
    this.Case_Type = this.testCase.Case_Type.toString();
    this.Case_Layer = this.testCase.Case_Layer.toString();
    this.Case_Flaky = this.testCase.Case_Flaky.toString();
    this.Case_Milestone = this.testCase.Case_Milestone.toString();
    this.Case_Behavior = this.testCase.Case_Behavior.toString();
    this.Case_AutoStat = this.testCase.Case_AutoStat.toString();

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


    this.api.UniCall(
      {
        CommandText: 'egsQADefectGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: this.testCase.Case_ID.toString()
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
            Value: this.testCase.Case_ID.toString()
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
            Value: this.testCase.Case_ID.toString()
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
                Value: this.testCase.Case_ID.toString()
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


      }

    });

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
  checkPrev(item: any) {
    console.log("hgse")
    var child = this.stepHistory.filter((x: any) => x.Case_StepID === item.Case_StepID);
    if (child.length > 1) {
      return true
    } else {
      return false
    }
  }
  closePanel() {
    if (this.panel != null)
      this.panel.nativeElement.style.display = "none";
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

  // @ViewChild('panelNavsub') panelNavsub?: ElementRef;
  // @ViewChild('subpanelContent') subpanelContent?: ElementRef;
  // @ViewChild('Descriptions') Descriptions?: ElementRef;
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
            Value: this.testCase.Case_ID.toString()
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

  deleteSuiteData() {
    var child = this.suites.filter(x => x.Parent_SuiteID === this.currentSuiteDelete.Suite_ID);

    //? If dont delete
    if (this.preventDeleteSuiteParent != 'delete') {
      let newRoot = '';
      var splited = this.preventDeleteSuiteParent.split("|");
      if (splited[0] === 'ProjectRoot') {
        newRoot = ''
      } else if ((splited[0] === 'ParentRoot')) {
        newRoot = splited[1].toString();
      }
      console.log(child[0])
      this.api.UniCall(
        {
          CommandText: 'egsQASuiteInsertUpdate',
          Params: [
            {
              Param: '@Suite_ID',
              Value: child[0].Suite_ID.toString()
            },
            {
              Param: '@Parent_SuiteID',
              Value: newRoot.toString() || null
            }
          ],
        }
      ).subscribe(
        {
          error: (msg) => {
            console.log(msg);
            alert("500 Internal Server Errors")
          },
          complete: () => {

            this.suitesDeleteArray = this.currentSuiteDelete.Suite_ID;
            // console.log(this.suitesDeleteArray);
            this.api.UniCall(
              {
                CommandText: 'egsQASuiteDelete',
                Params: [
                  {
                    Param: '@List',
                    Value: this.suitesDeleteArray.toString()
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
        }
      )
    }

    if (this.currentSuiteDelete != null && this.preventDeleteSuiteParent == 'delete') {
      if (child.length > 0) {
        for (let index = 0; index < child.length; index++) {
          if (this.deleteOnCascade(child[index].Suite_ID)) {
            this.suitesDeleteArray = this.suitesDeleteArray + ', ' + child[index].Suite_ID;
          }
        }
      }
      this.suitesDeleteArray = this.suitesDeleteArray + ', ' + this.currentSuiteDelete.Suite_ID;
      // console.log(this.suitesDeleteArray);
      console.log(this.suitesDeleteArray.toString());
      this.api.UniCall(
        {
          CommandText: 'egsQASuiteDelete',
          Params: [
            {
              Param: '@List',
              Value: this.suitesDeleteArray.toString()
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

  }

}
