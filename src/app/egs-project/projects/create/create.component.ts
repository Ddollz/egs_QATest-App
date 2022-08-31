import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { project } from '../../../models/project/project.model';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  //Update and Insert Variables
  Project_ID: string = '';
  User_ID: string = '1';
  Project_Name: string = '';
  Project_Code: string = '';
  Project_Description: string = '';
  Project_AccessType: string = '';
  Project_MemberAccess: string = '';
  Project_Status: string = '';

  projects: project[] = [];

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void { 
    // set 1st radio as default
    this.Project_AccessType = "1";
    this.Project_MemberAccess = "1";
  }

  updateInsertProject() {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectInsertUpdate',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID
          },
          {
            Param: '@User_ID',
            Value: this.User_ID
          },
          {
            Param: '@Project_Name',
            Value: this.Project_Name
          },
          {
            Param: '@Project_Code',
            Value: this.Project_Code
          },
          {
            Param: '@Project_Desc',
            Value: this.Project_Description
          },
          {
            Param: '@Project_AccessType',
            Value: this.Project_AccessType
          },
          {
            Param: '@Project_MemberAccess',
            Value: this.Project_MemberAccess
          },
          {
            Param: '@Project_Status',
            Value: this.Project_Status
          }
        ]
      }
    ).subscribe({
      error(msg) {
        console.log(msg);
        alert("500 Internal Server Errors")
      }
    });
  }
}
