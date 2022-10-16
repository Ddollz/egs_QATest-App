import { Component, OnInit, ViewChild } from '@angular/core';
import { testrun } from '../../../models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { reloadPage } from '../../../services/global-functions.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-test-run',
  templateUrl: './test-run.component.html',
  styleUrls: ['./test-run.component.css']
})
export class TestRunComponent implements OnInit {

  Project_ID: number = 0;

  TestRun_ID: string = '';
  TestRun_Title: string = '';

  testruns: testrun[] = [];

  displayedColumns: string[] = ['Status', 'Title', 'Environment', 'Time', 'Progress', 'ThreeDots'];
  dataSource = new MatTableDataSource<testrun>();

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(private api: ApiService) {
    this.Project_ID = Number(localStorage.getItem('currentProjectID'));

  }

  ngOnInit(): void {
    this.getTestRun();
  }

  getTestRun() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.testruns = value[0];
      console.log(this.testruns)
      this.dataSource = new MatTableDataSource<testrun>(this.testruns);
    });
  }

  formatDate(date: string) {
    return date.substring(0, 10) + ' ' + date.substring(11, 21);
  }

  openDeleteModal(id: string, title: string) {
    this.TestRun_ID = id;
    this.TestRun_Title = title;
  }

  deleteTestRun() {
    this.api.UniCall(
      {
        CommandText: 'egsQATestRunDelete',
        Params: [
          {
            Param: '@TestRun_ID',
            Value: this.TestRun_ID.toString()
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }
}
