import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { role, user } from '../../models/workspace/workspace.model';
import { CreateRoleComponent } from './create-role/create-role.component';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: role[] = [
    { value: 'Administrator',description:"Admin Description", checked: true, users : 2 },
    { value: 'Editor',description:"Editor Description", checked: true, users : 1 },
    { value: 'Guest',description:"Guest  Description", checked: true, users : 5 },
  ];
  displayedColumns: string[] = ['value','users','setting'];
  dataSource = new MatTableDataSource<role>(this.roles);
  @ViewChild(MatSort) sort: any = MatSort;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  constructor(private dialogRef : MatDialog) { }

  ngOnInit(): void {
  }

  openCreateRole(){
    this.dialogRef.open(CreateRoleComponent);
  }
}
