import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { role } from '../../models/workspace/workspace.model';
import { ApiService } from '../../services/api.service';
import { reloadPage } from '../../services/global-functions.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  //Modal Variables
  Modal_Title: string = '';
  Modal_btn: string = '';
  Modal_idDisable: boolean = false;

  //Update and Insert Variables
  Role_ID: string = '';
  Role_Name: string = '';
  Role_Description: string = '';
  Role_Code: string = '';

  //Table Initialize
  roles: role[] = [];
  displayedColumns: string[] = ['Role_Name', 'Role_Code', 'User', 'setting'];
  dataSource = new MatTableDataSource<role>();
  @ViewChild(MatSort) sort: any = MatSort;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  constructor(private api: ApiService) {

    this.api.UniCall(
      {
        CommandText: 'egsQARoleGet',
        Params: [
          {
            Param: '@Role_ID',
            Value: ''
          }
        ],
      }
    ).subscribe(value => {
      this.roles = value[0];
      this.dataSource = new MatTableDataSource<role>(this.roles);
      console.log(this.roles);
    }
    );
  }

  ngOnInit(): void {
  }

  openCreateRole() {
    this.Modal_Title = 'Create new role';
    this.Modal_btn = "Create";
    this.Modal_idDisable = false;
  }

  openUpdateRole(id: string, name: string, desc: string, code: string) {
    this.Modal_Title = 'Update role';
    this.Modal_btn = "Save";
    this.Modal_idDisable = true;
    this.Role_ID = id;
    this.Role_Name = name;
    this.Role_Description = desc;
    this.Role_Code = code;
  }

  updateInsertRole() {
    this.api.UniCall(
      {
        CommandText: 'egsQARoleInsertUpdate',
        Params: [
          {
            Param: '@Role_ID',
            Value: this.Role_ID.toString()
          },
          {
            Param: '@Role_Name',
            Value: this.Role_Name
          },
          {
            Param: '@Role_Description',
            Value: this.Role_Description
          },
          {
            Param: '@Role_Code',
            Value: this.Role_Code
          }
        ],
      }
    ).subscribe(
      (value) => {
        this.roles = value;
        console.log(this.roles)
      },
      (error) => {
        console.log(error);
        alert("500 Internal Server Errors")
      }, () => {
        reloadPage();

      }
    );
  }
  deleteRole(id: string) {
    this.api.UniCall(
      {
        CommandText: 'egsQARoleDelete',
        Params: [
          {
            Param: '@Role_ID',
            Value: id.toString()
          }
        ],
      }
    ).subscribe({
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
