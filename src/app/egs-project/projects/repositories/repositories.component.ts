import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { project, suite } from '../../../models/project/project.model';
import { reloadPage } from '../../../services/global-functions.service';
import { SuiteComponent } from './suite/suite.component';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  tempvalue: number = 4; //!remove this after project

  Modal_Title: string = "Create suite";
  Modal_btn: string = "Create";

  suites: suite[] = [];

  @Input() project = {} as project;

  Suite_ID: number = 0;
  Suite_Name: string = '';
  Suite_Root: string = 'ProjectRoot|' + this.project.Project_ID;
  Parent_SuiteID: string = '';
  Description: string = '';
  Preconditions: string = '';
  Suite_isLock: number = 0;
  Suite_TempUserID: number = 1; //! This is only temporary change/remove this when token/auth is on

  constructor(private api: ApiService) {
    this.getCurrentProjectSuite();
    //!This is ONLY TEMPORARY REMOVE WHEN PROJECT CREATION PAGE IS FINISHED
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: '4'
          }
        ],
      }
    ).subscribe(value => {
      this.project = value[0][0];
      this.Suite_Root = 'ProjectRoot|' + this.project.Project_ID;
    }
    );
    //!This is ONLY TEMPORARY REMOVE WHEN PROJECT CREATION PAGE IS FINISHED
  }

  ngOnInit(): void {
  }

  getCurrentProjectSuite() {

    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: '4'
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
      this.Suite_Root = this.tempvalue.toString();
    }

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
        next(position: any) {
          console.log(position);
        },
        error(msg) {
          console.log(msg);
          alert("500 Internal Server Errors")
        },
        complete() {
          reloadPage();
        }
      }
    );
  }

}
