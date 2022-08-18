import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatRadioChange } from '@angular/material/radio';
import { role, user } from '../../models/workspace/workspace.model';

const ELEMENT_DATA: user[] = [
  { id: 23, firstname: 'Karl Erol', lastname: 'Pasion', email: "pasionkarlerol@gmail.com", role: 'Administrator', roleTitle: "QA Lead", status: 1 },
  { id: 2, firstname: 'Royce', lastname: 'Esguerra', email: "Royce@gmail.com", role: 'Editor', roleTitle: "QA Tester", status: 1 },
  { id: 3, firstname: 'Lance Andre', lastname: 'Rivera', email: "Lance@gmail.com", role: 'Guest', roleTitle: "Developer", status: -1 },
  { id: 4, firstname: 'Krystel', lastname: 'Nicomedes', email: "krystel.nicomedes@eg-software.com", role: 'Guest', roleTitle: "Developer", status: 1 },
  { id: 5, firstname: 'Rica', lastname: 'Isidto', email: "ricamae.isidto@eg-software.com", role: 'Guest', roleTitle: "Developer", status: 1 },
  { id: 43, firstname: 'Karl Erol', lastname: 'Pasion', email: "pasionkarlerol@gmail.com", role: 'Administrator', roleTitle: "QA Lead", status: 1 },
  { id: 2, firstname: 'Royce', lastname: 'Esguerra', email: "Royce@gmail.com", role: 'Editor', roleTitle: "QA Tester", status: 1 },
  { id: 3, firstname: 'Lance Andre', lastname: 'Rivera', email: "Lance@gmail.com", role: 'Guest', roleTitle: "Developer", status: -1 },
  { id: 4, firstname: 'Krystel', lastname: 'Nicomedes', email: "krystel.nicomedes@eg-software.com", role: 'Guest', roleTitle: "Developer", status: 1 },
  { id: 5, firstname: 'Rica', lastname: 'Isidto', email: "ricamae.isidto@eg-software.com", role: 'Guest', roleTitle: "Developer", status: 1 },
];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'status', 'name', 'role', 'roleTitle'];
  dataSource = new MatTableDataSource<user>(ELEMENT_DATA);
  @ViewChild(MatSort) sort: any = MatSort;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  filterRoleText: any;
  filterStatusText: any;
  statusSelect: string = 'Multiple';
  roleSelect: string = 'Multiple';

  roles: role[] = [
    { Role_ID:'1', Role_Name: 'Administrator', Role_Description: "Admin Description", Role_Code: 'ADM',Users:'0'},
    { Role_ID:'2', Role_Name: 'Guest', Role_Description: "Admin Description", Role_Code: 'ADM',Users:'0'},
    { Role_ID:'3', Role_Name: 'Editor', Role_Description: "Admin Description", Role_Code: 'ADM',Users:'0'}
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.filterRoleText = document.querySelector('#filter-role');
    this.filterStatusText = document.querySelector('#filter-status');
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.status === Number(filter)
        || (data.firstname.toLowerCase() +" "+ data.lastname.toLowerCase()).includes(filter)
        || data.role.toLowerCase().includes(filter)
        || data.roleTitle.toLowerCase().includes(filter)
        || data.email.toLowerCase().includes(filter);
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
    let objIndex = ELEMENT_DATA.findIndex((obj => obj.id == id));
    //Update object's name property.
    if (ELEMENT_DATA[objIndex].status == 1) {
      ELEMENT_DATA[objIndex].status = -1;
    } else {
      ELEMENT_DATA[objIndex].status = 1;
    }
    console.log(ELEMENT_DATA);
  }

}
