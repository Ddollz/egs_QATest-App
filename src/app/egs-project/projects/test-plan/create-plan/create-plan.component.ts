import {  AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { testplan, testCase, suite, project, testplanCases } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { sidebarService } from '../../../../services/global-functions.service';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']
})
export class CreatePlanComponent implements OnInit {

  // Selection Variables
  SelectedTestCase: string = '';
  SelectedTestCaseCount: number = 0;
  CurrentTestCase: string = '';
  CurrentTestCaseCount: number = 0;
  SelectedSuite: string = '';
  SelectedSuiteCount: number = 0;
  suiteModel = new SelectionModel(
    true,   // multiple selection or not
  );

  testCaseModel = new SelectionModel(
    true,   // multiple selection or not
  );

  //Utilities
  LinkParamID: number = 0;
  S_ID: number = 0;
  S_Name: string ='';
  S_Desc: string ='';
  addCasesLength = 0;
  ACLength = 0;
  finalAddCases ='';
  isCasesChecked: boolean = false;
  checked: boolean = false;

  //Activated Route
  index: number = 0;
  Page_title: string = 'Create Test Plan';
  Button_title: string = 'Create Plan';

  //Update and Insert Variables
  TestPlan_ID: string = '';
  TestPlan_Title: string = '';
  TestPlan_Desc: string = '';
  TestPlan_CaseCount: string = '';
  TestPlan_RunTime: string = '';
  Case_ID: string = '';

  //Project Modals
  suites: suite[] = [];
  testplans: testplan[] = [];
  testCases: testCase[] = [];
  newTestCases: testCase[] = [];
  testplanCases: testplanCases [] = [];
  addCases : number[] = []
  @Input() project = {} as project;

  //Table
  displayedColumns: string[] = ['TestCase_CheckBox', 'TestCase_Add', 'TestCase_Title'];
  casesDataSource = new MatTableDataSource<testCase>();
  suitedataSource = new MatTableDataSource<suite>();
  tpCasesDataSource = new MatTableDataSource<testplanCases>();

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private sidebarServ: sidebarService) {
    this.LinkParamID = sidebarServ.projectID;

    console.log(this.LinkParamID.toString())
    
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit Test Plan';
      this.Button_title = 'Save';
      
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
        console.log(this.suites)
        
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
          this.newTestCases = value[0];
          console.log(this.newTestCases)
          this.getTestPlan();
        });
      });
    }

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
      console.log(this.suites)
      
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
        this.newTestCases = value[0];
        console.log(this.newTestCases)
      });
    });

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
      }
    })
    //END

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

  ngOnInit(): void {
  }

  selectedSuiteCheck(event: number, bool: boolean = false) {

    if (bool) return this.suiteModel.deselect(event)
    this.suiteModel.toggle(event)
    if (this.suiteModel.isSelected(event)) {
      let tempCases = this.testCases.filter(x => x.Suite_ID === event);
      // console.log(tempCases)
      for (let index = 0; index < tempCases.length; index++) {
        this.testCaseModel.select(tempCases[index].Case_ID)
        // console.log(this.testCaseModel.select(tempCases[index].Case_ID))
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
    console.log(this.suites)
    console.log(sD)
    console.log(child)
    // console.log(this.testCaseModel.selected)
    // this.currentTestCaseModel.selected.length = child.length;
    // console.log(this.testCaseModel.selected.length)
    // for (let index = 0; index < child.length; index++) {
    //   // console.log(value[0][index])
    //   this.testCaseModel.deselect(child[index].Case_ID)
    // }
    var temporaryTestCase = this.testCaseModel.selected.filter((x: any) => {
      if (child.some((item) => item.Case_ID == x)) {
        return x
      }
      })
    console.log(temporaryTestCase) 

    if (child.length == temporaryTestCase.length) {
      this.selectedSuiteCheck(sD);
    } else {
      this.selectedSuiteCheck(sD, true);
    }

    // console.log(sD)
    console.log(child.length)
    console.log(this.testCaseModel.selected.length)
    console.log(this.CurrentTestCaseCount)
  }

  checkbox(event: Event, num: number, bool: boolean = false) {
    event.stopPropagation()
    event.preventDefault()
    // this.checked = !this.checked;

    this.selectedSuiteCheck(num, bool)
    // this.selectEvent.emit(this.Suite.Suite_ID);
  }

  selectAll($event: any) {
    if($event.checked){
      this.isCasesChecked = true;
    }
    else{
      this.isCasesChecked = false;
    }
  }

  receiveName($event: string){
    this.S_Name = $event
  }
  

  receiveDesc($event: string){
    this.S_Desc = $event
  }

  receiveID($event: number){
    // this.CurrentTestCase = '';
    // this.CurrentTestCaseCount = 0;
    this.S_ID = $event

    // console.log(this.CurrentTestCaseCount)
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseGet',
        Params: [
          {
            Param: '@Suite_ID',
            Value: this.S_ID.toString()
            // Value: this.LinkParamID.toString()
          }
        ],
      }
    ).subscribe(value => {
      this.testCases = value[0];
      this.casesDataSource = new MatTableDataSource<testCase>(this.testCases);
      // console.log(this.testCases);
      // console.log(this.testCasesdataSource);
      // console.log(this.testCasesdataSource.filteredData)
      // console.log(this.S_ID);
    });
  }

  selectCase($event: any, ID: number, Name: string){
    if($event.checked){
      this.addCases.push(ID)
      console.log(this.addCases)
      this.addCases = [...new Set(this.addCases)]
      this.addCasesLength = this.addCases.length
      console.log(this.addCasesLength)
      
    }
    else {
      this.addCases.splice(this.addCases.indexOf(ID), 1)
      console.log(this.addCases)
      this.addCasesLength = this.addCases.length
      console.log(this.addCasesLength)
    }
  }

  getSelectedCase(){
    // this.router.navigate(["/projects/plan/createplan"])
    this.finalAddCases = "[" + this.SelectedTestCase + "]"
    console.log(this.finalAddCases)
    this.ACLength = this.SelectedTestCaseCount
  }

  closeAddCases(){
    // this.addCases = [];
  }

  updateInsertTestPlan() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanInsertUpdate',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.TestPlan_ID.toString()
          },
          {
            Param: '@TestPlan_Title',
            Value: this.TestPlan_Title
          },
          {
            Param: '@TestPlan_Desc',
            Value: this.TestPlan_Desc
          },
          {
            Param: '@TestPlan_CaseCount',
            Value: this.TestPlan_CaseCount
          },
          {
            Param: '@TestPlan_RunTime',
            Value: this.TestPlan_RunTime
          },
          {
            Param: '@Case_ID',
            Value: this.finalAddCases.toString()
          },
          {
            Param: '@User_ID',
            Value: '1' //assignee
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["/projects/plan"])
    });
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
      // console.log(value);
      // console.log(value[0]);
      // console.log(value[0][0]);
      this.testplans = value[0][0];
      this.TestPlan_ID = value[0][0].TestPlan_ID;
      this.TestPlan_Title = value[0][0].TestPlan_Title;
      this.TestPlan_Desc = value[0][0].TestPlan_Desc;
      this.TestPlan_CaseCount = value[0][0].TestPlan_CaseCount;
    });

    this.api.UniCall(
      {
        CommandText: 'egsQATestPlanCasesGet',
        Params: [
          {
            Param: '@TestPlan_ID',
            Value: this.index.toString()
          }
        ],
      }
    ).subscribe(value => {
      // console.log(value)
      
      for (let index = 0; index < value[0].length; index++) {
        // console.log(value[0][index])
        this.testCaseModel.select(value[0][index].Case_ID);
      }
      // this.selectedSuiteCheck(sD);
      for (let index = 0; index < this.suites.length; index++) {
        // console.log(this.suites[index].Suite_ID)
        // console.log(this.newTestCases)
        var child = this.newTestCases.filter(x => 
          x.Suite_ID === this.suites[index].Suite_ID
          // console.log(x.Suite_ID)
        );
        // console.log(child)
        var temporaryTestCase = this.testCaseModel.selected.filter((x: any) => {
          if (child.some((item) => item.Case_ID == x)) {
            return x
          }
          })
        // console.log(temporaryTestCase) 

        if (child.length == temporaryTestCase.length) {
          this.selectedSuiteCheck(this.suites[index].Suite_ID);
        } 
          
        }
      // console.log(this.testCaseModel.selected)
    });

  }

  applyFilter(event?: Event) {
    this.suitedataSource.filterPredicate = function(data, filter: string): boolean {
      return data.Suite_Name.toLowerCase().includes(filter) == filter.trim().toLowerCase().includes(filter);
    }
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.suitedataSource.filter = filterValue.trim().toLowerCase();
    }
  }
}
