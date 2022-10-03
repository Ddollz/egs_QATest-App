import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { step, testCase } from 'src/app/models/project/project.model';
import { user } from 'src/app/models/workspace/workspace.model';
import { ApiService } from 'src/app/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { reloadPage, sidebarService } from 'src/app/services/global-functions.service';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-trash-bin',
  templateUrl: './trash-bin.component.html',
  styleUrls: ['./trash-bin.component.css']
})
export class TrashBinComponent implements OnInit {
  projectID: number = 0;
  users: user[] = [];
  testCases: testCase[] = [];
  steps: step[] = [];
  currentDate: Date = new Date();

  displayedColumns: string[] = ['select', 'testcase', 'deleted', 'deletedby', 'steps', 'testruns', 'control'];
  dataSource = new MatTableDataSource<testCase>();

  testcaseSelect: any;
  testCaseModel = new SelectionModel(
    true,   // multiple selection or not
  );
  constructor(public sidebarServ: sidebarService, private activatedRoute: ActivatedRoute, private api: ApiService) {
    this.projectID = Number(sidebarServ.projectID);
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseHistoryGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.projectID.toString()
          }
        ],
      }
    ).subscribe(value => {
      console.log(value[1]);
      this.testCases = value[0];
      this.steps = value[1];
      this.dataSource = new MatTableDataSource<testCase>(this.testCases);
    });

    //! May change after user management is complete
    //! Note: May change because limitation of user can manage the project
    this.api.UniCall(
      {
        CommandText: 'egsQAAccountGet',
        Params: [
          {
            Param: '@User_Email',
            Value: null
          }
        ],
      }
    ).subscribe(value => {
      this.users = value[0];
    });
    //! end

    this.testCaseModel.changed.subscribe({
      next: (e) => {
        // console.log(e)
        // console.log(JSON.stringify(e.source.selected))
        this.testcaseSelect = JSON.stringify(e.source.selected);
      }
    })

  }

  ngOnInit(): void {
  }

  selectedTestCaseCheck(event: number) {
    this.testCaseModel.toggle(event)
  }

  getDateBetween(date: Date) {
    var dates = new Date(date);
    this.currentDate = new Date();
    var diffMonth = this.currentDate.getMonth() - dates.getMonth();
    var diff = this.currentDate.getTime() - dates.getTime();
    var weeks = Math.round(diff / (7 * 24 * 60 * 60 * 1000));
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

    if (diffMonth > 0) return diffMonth;
    if (weeks > 0) return weeks + " weeks " + 'ago';
    if (days > 0) return days + " days " + 'ago';
    if (hours > 0) return hours + " hours " + 'ago';
    if (minutes > 0) return minutes + " minutes " + 'ago';
    if (seconds > 0) return seconds + " seconds " + 'ago';
    return
  }

  getCountStep(caseID: number) {
    return this.steps.filter(x => x.Case_ID === caseID).length + " steps";
  }

  getUser(userID: number) {
    let user = this.users.find(x => x.User_ID === userID);
    return user?.User_Firstname + " " + user?.User_Lastname;
  }
  MultiRestoreCase() {

    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseHistoryMultiRestore',
        Params: [
          {
            Param: '@Case_Json',
            Value: this.testcaseSelect
          }
        ],
      }
    ).subscribe(
      {
        error: (e) => console.error(e),
        complete() {
          reloadPage();
        },
      }
    )
  }
  restoreCase(testcase: testCase) {
    let attachmentParameter = testcase.Attachments_ID
    if (attachmentParameter?.length == 0 || attachmentParameter == undefined) {
      attachmentParameter = undefined
    } else {
      attachmentParameter = attachmentParameter.toString()
    }
    this.api.UniCall(
      {
        CommandText: 'egsQATestCaseHistoryRestore',
        Params: [
          {
            Param: '@Case_ID',
            Value: testcase.Case_ID.toString()
          },
          {
            Param: '@Case_Title',
            Value: testcase.Case_Title
          },
          {
            Param: '@Case_Status',
            Value: testcase.Case_Status.toString()
          },
          {
            Param: '@Case_Desc',
            Value: testcase.Case_Desc
          },
          {
            Param: '@Suite_ID',
            Value: testcase.Suite_ID.toString()
          },
          {
            Param: '@Case_Severity',
            Value: testcase.Case_Severity.toString()
          },
          {
            Param: '@Case_Priority',
            Value: testcase.Case_Priority.toString()
          },
          {
            Param: '@Case_Type',
            Value: testcase.Case_Type.toString()
          },
          {
            Param: '@Case_Layer',
            Value: testcase.Case_Layer.toString()
          },
          {
            Param: '@Case_Flaky',
            Value: testcase.Case_Flaky.toString()
          },
          {
            Param: '@Case_isLock',
            Value: testcase.Case_isLock.toString()
          },
          {
            Param: '@User_ID',
            Value: testcase.User_ID.toString()
          },
          {
            Param: '@Case_Milestone',
            Value: testcase.Case_Milestone.toString()
          },
          {
            Param: '@Case_Behavior',
            Value: testcase.Case_Behavior.toString()
          },
          {
            Param: '@Case_AutoStat',
            Value: testcase.Case_AutoStat.toString()
          },
          {
            Param: '@Case_PreCondition',
            Value: testcase.Case_PreCondition
          },
          {
            Param: '@Case_PostCondition',
            Value: testcase.Case_PostCondition
          },
          {
            Param: '@Case_Tag',
            Value: testcase.Case_Tag
          },
          {
            Param: '@Case_Param',
            Value: testcase.Case_Param
          },
          {
            Param: '@LastModifiedUser',
            Value: testcase.LastModifiedUser.toString()
          },
          {
            Param: '@Project_ID',
            Value: testcase.Project_ID.toString()
          },
        ],
      }
    ).subscribe(
      {
        error: (e) => console.error(e),
        complete() {
          reloadPage();

        },
      }
    )
  }
}
