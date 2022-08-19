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
      this.users = value[0];
      this.dataSource = new MatTableDataSource<user>(this.users);
      console.log(value);
    }
    );
  }

  ngOnInit(): void {
    this.filterRoleText = document.querySelector('#filter-role');
    this.filterStatusText = document.querySelector('#filter-status');
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.User_Status === Number(filter)
        || (data.User_Firstname.toLowerCase() +" "+ data.User_Firstname.toLowerCase()).includes(filter)
        || data.Role.toLowerCase().includes(filter)
        || data.RoleTitle.toLowerCase().includes(filter)
        || data.User_Email.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event?: Event, valueFilter?: MatRadioChange) {
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log(this.dataSource.filter);
    } else if (valueFilter != null) {
      this.dataSource.filter = valueFilter.value.trim().toLowerCase();
      console.log(this.dataSource.filter);
    }
  }
  changeDropdownText() {
    if (this.roleSelect)
      this.filterRoleText.innerHTML = this.roleSelect;
    else {
      this.filterRoleText.innerHTML = 'Multiple';
    }
    if (this.statusSelect == '1')
      this.filterStatusText.innerHTML = 'Active';
    else if (this.statusSelect == '-1')
      this.filterStatusText.innerHTML = 'Inactive';
    else
      this.filterStatusText.innerHTML = 'Multiple';
  }
  changeStatus(id: number) {
    //Find index of specific object using findIndex method.
    let objIndex = this.users.findIndex((obj => obj.User_ID == id));
    //Update object's name property.
    if (this.users[objIndex].User_Status == 1) {
      this.users[objIndex].User_Status = -1;
    } else {
      this.users[objIndex].User_Status = 1;
    }
    console.log(this.users);
  }

}
