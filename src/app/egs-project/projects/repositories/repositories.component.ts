import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { project, suite, testCase, step } from '../../../models/project/project.model';
import { reloadPage, sidebarService } from '../../../services/global-functions.service';
@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  //Utilities
  LinkParamID: number = 0;
  suitesDeleteArray: string = '';


  //Modal
  Modal_Title: string = "Create suite";
  Modal_btn: string = "Create";

  //Project Modals
  suites: suite[] = [];
  testCases: testCase[] = [];
  @Input() project = {} as project;
  steps: step[] = [];

  //Table Steps
  displayedColumns: string[] = ['Step', 'Action', 'Input', 'Expected'];
  dataSource = new MatTableDataSource<step>();
  @ViewChild(MatSort) sort: any = MatSort;

  //Case Description Variables
  testCaseID: number = 0;
  testCase = {} as testCase;
  @ViewChild('casePanel') panel?: ElementRef;
  @ViewChild('General') General?: ElementRef;
  @ViewChild('Properties') Properties?: ElementRef;
  Case_Severity: string = '';
  Case_Priority: string = '';
  Case_Type: string = '';
  Case_Layer: string = '';
  Case_Flaky: string = '';
  Case_Milestone: string = '';
  Case_Behavior: string = '';
  Case_AutoStat: string = '';

  Suite_ID: number = 0;
  Suite_Name: string = '';
  Suite_Root: string = 'ProjectRoot|' + this.project.Project_ID;
  Parent_SuiteID: string = '';
  Description: string = '';
  Preconditions: string = '';
  Suite_isLock: number = 0;
  Suite_TempUserID: number = 1; //! This is only temporary change/remove this when token/auth is on


  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private sidebarServ: sidebarService) {

    this.LinkParamID = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.sidebarServ.fetchProjectID(this.LinkParamID);


    this.getCurrentProjectSuite();

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
      this.Suite_Root = 'ProjectRoot|' + this.project.Project_ID;
    }
    );

    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Case_ID',
            Value: ''
          }
        ],
      }
    ).subscribe(value => {
      this.testCases = value[0];
      console.log(this.testCases);
    }
    );


  }

  ngOnInit(): void {
  }
  toggleDropdown(event: Event) {
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
    }
    event.preventDefault();
    event.stopPropagation();
  }
  onQuickCaseEnter(event: any) {
    console.log(event.target.value);
    var dom = event.currentTarget as HTMLElement;
    var sID = dom.getAttribute('suiteattri')
    this.api.UniCall(
      {
        CommandText: 'egsQACaseAndStepInsert',
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
            Value: '1'
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
        ],
      }
    ).subscribe(
      {
        next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => reloadPage()
      }
    )
  }
  getCurrentProjectSuite() {

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
    }
    );
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
    console.log(this.Parent_SuiteID);
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
        next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => reloadPage()
      }
    )
  }
  editSuite(editSuite: number) {
    this.Modal_Title = "Edit suite";
    this.Modal_btn = "Edit";
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

    var currentSuite = this.suites.find(x => x.Suite_ID === suiteID);
    var child = this.suites.filter(x => x.Parent_SuiteID === suiteID);
    if (currentSuite != null) {
      if (child.length > 0) {
        for (let index = 0; index < child.length; index++) {
          if (this.deleteOnCascade(child[index].Suite_ID)) {
            this.suitesDeleteArray = this.suitesDeleteArray + ', ' + child[index].Suite_ID;
          }
        }
      }
      this.suitesDeleteArray = this.suitesDeleteArray + ', ' + currentSuite.Suite_ID;
      console.log(this.suitesDeleteArray);
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
          next: (v) => console.log(v),
          error: (e) => { console.error(e); alert("500 Internal Server Errors") },
          complete: () => reloadPage()
        }
      )
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
    console.log(testc.Case_ID);
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
      this.steps = value[0];
      this.dataSource = new MatTableDataSource<step>(this.steps);
      console.log(this.steps)
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
  }
  closePanel() {
    if (this.panel != null)
      this.panel.nativeElement.style.display = "none";
  }
  changePanelContent(value: string) {
    if (this.Properties != null && this.General != null) {
      if (value === 'General') {
        this.Properties.nativeElement.style.display = 'none';
        this.General.nativeElement.style.display = 'block';
      }
      if (value === 'Property') {
        this.Properties.nativeElement.style.display = 'block';
        this.General.nativeElement.style.display = 'none';
      }
    }
  }
  deleteCase(value:number){
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseDelete',
        Params: [
          {
            Param: '@Case_ID',
            Value: value.toString()
          }
        ],
      }
    ).subscribe(
      {
        next: (v) => console.log(v),
        error: (e) => { console.error(e); alert("500 Internal Server Errors") },
        complete: () => reloadPage()
      }
    )
  }
}
