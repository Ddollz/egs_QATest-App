import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { project, suite, testCase } from '../../../models/project/project.model';
import { reloadPage } from '../../../services/global-functions.service';
import { sidebarService } from '../../../services/global-functions.service';
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


  //Case Description Variables
  testCaseID: number = 0;
  testCase = {} as testCase;
  @ViewChild('casePanel') panel?: ElementRef;

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
    var test = element.getAttribute('data-bs-target')
    if (test != null) {
      var test2 = document.getElementById(test.toString())
      if (test2?.classList.contains("show"))
        test2?.classList.remove("show")
      else
        test2?.classList.add("show")
    }
    event.preventDefault();
    event.stopPropagation();
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
  thisisfunction(event: Event, testc: testCase) {
    console.log(event.currentTarget)
    var caseRow = event.currentTarget as HTMLElement;
    caseRow.focus();
    this.testCase = testc;
    if (this.panel != null)
      this.panel.nativeElement.style.display = "flex";
  }
  closePanel(){
    if (this.panel != null)
      this.panel.nativeElement.style.display = "none";
  }
}
