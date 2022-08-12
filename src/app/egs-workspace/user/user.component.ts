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
    { value: 'Administrator',description:"Admin Description", checked: true, users : 2 },
    { value: 'Editor',description:"Editor Description", checked: true, users : 1 },
    { value: 'Guest',description:"Guest  Description", checked: true, users : 5 },
  ];

  constructor() {
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

    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
      console.log(this.dataSource.filter);
    } else if (valueFilter != null) {
      this.dataSource.filter = valueFilter.value;
    }
  }
  changeDropdownText() {
    this.filterRoleText.innerHTML = this.roleSelect;
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
    if (ELEMENT_DATA[objIndex].status) {
      ELEMENT_DATA[objIndex].status = -1;
    } else {
      ELEMENT_DATA[objIndex].status = 1;
    }
    console.log(ELEMENT_DATA);
  }
  displayDropdown(event: Event) {
    const element = event.currentTarget as HTMLElement;
    const e = element.nextSibling as HTMLElement;
    if (e.classList.contains('hide')) {
      e.classList.remove('hide');
    } else {
      e.classList.add('hide');
    }

  }

}
// event: { target: HTMLInputElement }
