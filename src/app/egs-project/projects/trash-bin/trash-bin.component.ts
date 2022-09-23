import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { step, testCase } from 'src/app/models/project/project.model';
import { user } from 'src/app/models/workspace/workspace.model';
import { ApiService } from 'src/app/services/api.service';
import { sidebarService } from 'src/app/services/global-functions.service';
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
      console.log(value);
      this.users = value[0];
      console.log(value[0]);
    });
    //! end

  }

  ngOnInit(): void {
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
}
