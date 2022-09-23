import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface testRun {
  id: number;
  title: string;
  environment: string;
  datestart: string;
  time: string;
  status: number;
}

const data: testRun[] = [
  { id: 23, title: 'Test run 2022/05/23', environment: '', datestart: '2022/05/23', time: "00:00:00", status: 100 },
  { id: 2, title: 'Test run 2022/05/22', environment: '', datestart: '2022/05/22', time: "00:00:00", status: 88 },
  { id: 3, title: 'Test run 2022/05/21', environment: '', datestart: '2022/05/21', time: "00:00:00", status: 90 },
  { id: 4, title: 'Test run 2022/05/20', environment: '', datestart: '2022/05/20', time: "00:00:00", status: 70 },
  { id: 5, title: 'Test run 2022/05/19', environment: '', datestart: '2022/05/19', time: "00:00:00", status: 50 },
  { id: 43, title: 'Test run 2022/05/26', environment: '', datestart: '2022/05/23', time: "00:00:00", status: 100 },
  { id: 2, title: 'Test run 2022/05/27', environment: '', datestart: '2022/05/23', time: "00:00:00", status: 0 },
  { id: 3, title: 'Test run 2022/05/28', environment: '', datestart: '2022/05/23', time: "00:00:00", status: 30 },
  { id: 4, title: 'Test run 2022/05/29', environment: '', datestart: '2022/05/23', time: "00:00:00", status: 87 },
  { id: 5, title: 'Test run 2022/05/30', environment: '', datestart: '2022/05/23', time: "00:00:00", status: 67 },
];

@Component({
  selector: 'app-test-run',
  templateUrl: './test-run.component.html',
  styleUrls: ['./test-run.component.css']
})
export class TestRunComponent implements OnInit {

  displayedColumns: string[] = ['Status', 'Title', 'Environment', 'Time', 'Progress', 'ThreeDots'];
  dataSource = new MatTableDataSource<testRun>(data);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  constructor() { }

  ngOnInit(): void {
    console.log(this.dataSource.filteredData.length);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
