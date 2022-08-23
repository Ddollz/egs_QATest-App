import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { project } from '../../../models/project/project.model';
import { reloadPage } from '../../../services/global-functions.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  //Update and Insert Variables
  Project_ID: number = 0;
  User_ID: number = 1;
  Project_Name: string = '';
  Project_Code: string = '';
  Project_Description: string = '';
  Project_AccessType: number = 0;
  Project_MemberAccess: number = 0;
  Project_Status: number = 0;

  projects: project[] = [];

  formGroup = new FormGroup({
    accessType: new FormControl(),
    memberAccess: new FormControl()
  });

  constructor(private api: ApiService) { }

  ngOnInit(): void { }

  updateInsertProject() {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectInsertUpdate',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          },
          {
            Param: '@User_ID',
            Value: this.User_ID.toString()
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
            Value: this.formGroup.controls.accessType.value.toString()
          },
          {
            Param: '@Project_MemberAccess',
            Value: this.formGroup.controls.memberAccess.value.toString()
          },
          {
            Param: '@Project_Status',
            Value: this.Project_Status.toString()
          },
        ],
      }
    ).subscribe({
      // (value) => {
      //   this.projects = value;
      //   console.log(this.projects)
      // },
      // (error) => {
      //   console.log(error);
      //   alert("500 Internal Server Errors");
      // }, () => {
      //   reloadPage();
      // }
      error(msg) {
        console.log(msg);
        alert("500 Internal Server Errors")
      }
    }
    );
  }

}
