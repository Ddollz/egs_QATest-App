import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
export interface PeriodicElement {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  roleTitle: string;
  status: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, firstname: 'Karl Erol', lastname: 'Pasion', email: "pasionkarlerol@gmail.com", role: 'Administrator', roleTitle: "QA Lead", status: 1 },
  { id: 2, firstname: 'Royce', lastname: 'Esguerra', email: "Royce@gmail.com", role: 'Editor', roleTitle: "QA Tester", status: 1 },
  { id: 3, firstname: 'Lance Andre', lastname: 'Rivera', email: "Lance@gmail.com", role: 'Guest', roleTitle: "Developer", status: 0 },
  { id: 4, firstname: 'Krystel', lastname: 'Nicomedes', email: "krystel.nicomedes@eg-software.com", role: 'Guest', roleTitle: "Developer", status: 1 },
  { id: 5, firstname: 'Rica', lastname: 'Isidto', email: "ricamae.isidto@eg-software.com", role: 'Guest', roleTitle: "Developer", status: 1 },
  { id: 1, firstname: 'Karl Erol', lastname: 'Pasion', email: "pasionkarlerol@gmail.com", role: 'Administrator', roleTitle: "QA Lead", status: 1 },
  { id: 2, firstname: 'Royce', lastname: 'Esguerra', email: "Royce@gmail.com", role: 'Editor', roleTitle: "QA Tester", status: 1 },
  { id: 3, firstname: 'Lance Andre', lastname: 'Rivera', email: "Lance@gmail.com", role: 'Guest', roleTitle: "Developer", status: 0 },
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
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatSort) sort: any = MatSort;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
}
