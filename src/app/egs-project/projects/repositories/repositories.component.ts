import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { project, suite } from '../../../models/project/project.model';
import { reloadPage } from '../../../services/global-functions.service';
@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  LinkParamID: number = 0;

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

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.LinkParamID = Number(this.activatedRoute.snapshot.paramMap.get('id'));

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
