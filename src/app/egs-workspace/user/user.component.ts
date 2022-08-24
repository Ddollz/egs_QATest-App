import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatRadioChange } from '@angular/material/radio';
import { role, user } from '../../models/workspace/workspace.model';
import { ApiService } from '../../services/api.service';
import { reloadPage } from '../../services/global-functions.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {

  users: user[] = [];

  displayedColumns: string[] = ['id', 'status', 'name', 'role', 'roleTitle'];
  dataSource = new MatTableDataSource<user>();
  @ViewChild(MatSort) sort: any = MatSort;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  filterRoleText: any;
  filterStatusText: any;
  statusSelect: string = 'Multiple';
  roleSelect: string = 'Multiple';



  roles: role[] = [];

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
    }
    );


    this.api.UniCall(
      {
        CommandText: 'egsQAAccountGet',
        Params: [
          {
            Param: '@User_Email',
            Value: ''
          }
        ],
      }
    ).subscribe(value => {
      for (let index = 0; index < value[0].length; index++) {
        if (value[0][index].User_Status == 1)
          value[0][index].User_Status = "Active";
        if (value[0][index].User_Status == -1)
          value[0][index].User_Status = "Inactive";
      }
      this.users = value[0];
      console.log(this.users)
      this.dataSource = new MatTableDataSource<user>(this.users);
    }
    );
  }

  ngOnInit(): void {
    this.filterRoleText = document.querySelector('#filter-role');
    this.filterStatusText = document.querySelector('#filter-status');

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event?: Event, valueFilter?: MatRadioChange) {

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.User_Status.trim().toLocaleLowerCase() === filter.trim().toLocaleLowerCase()
        || (data.User_Firstname.toLowerCase() + " " + data.User_Firstname.toLowerCase()).includes(filter)
        || data.Role.toLowerCase().includes(filter)
        || data.RoleTitle.toLowerCase().includes(filter)
        || data.User_Email.toLowerCase().includes(filter);
    };
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

    } else if (valueFilter != null) {

      this.dataSource.filter = valueFilter.value;

    }
  }
  changeDropdownText() {
    if (this.roleSelect)
      this.filterRoleText.innerHTML = this.roleSelect;
    else {
      this.filterRoleText.innerHTML = 'Multiple';
    }
    if (this.statusSelect == 'Active')
      this.filterStatusText.innerHTML = 'Active';
    else if (this.statusSelect == 'Inactive')
      this.filterStatusText.innerHTML = 'Inactive';
    else
      this.filterStatusText.innerHTML = 'Multiple';
  }
  onSelectionChangeRole(id: number, event?: any) {
    console.log(event);
    let objIndex = this.roles.find(obj => obj.Role_Name == event.value);
    console.log(objIndex?.Role_ID);
    if (objIndex != null) {
      console.log(objIndex.Role_ID);
      this.api.UniCall(
        {
          CommandText: 'egsQAAccountInsertUpdate',
          Params: [
            {
              Param: '@User_id',
              Value: id.toString()
            },
            {
              Param: '@Role_ID',
              Value: objIndex.Role_ID.toString()
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
        }
      }
      );
    }
  }
  changeStatus(id: number) {
    let objIndex = this.users.findIndex((obj => obj.User_ID == id));
    console.log(id)
    let tempVal = 0;
    //Update object's name property.
    if (this.users[objIndex].User_Status == "Active") {
      this.users[objIndex].User_Status = "Inactive";
      tempVal = -1;
    } else {
      this.users[objIndex].User_Status = "Active";
      tempVal = 1;
    }

    this.api.UniCall(
      {
        CommandText: 'egsQAAccountInsertUpdate',
        Params: [
          {
            Param: '@User_id',
            Value: id.toString()
          },
          {
            Param: '@User_Status',
            Value: tempVal.toString()
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
      }
    }
    );

  }

}
