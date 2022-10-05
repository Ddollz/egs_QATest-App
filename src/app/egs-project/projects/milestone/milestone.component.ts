import { Component, OnInit, ViewChild } from '@angular/core';
import { milestone } from '../../../models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { reloadPage } from '../../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.css']
})
export class MilestoneComponent implements OnInit {

  Milestone_ID: string = '';
  Milestone_Title: string = '';

  milestones: milestone[] = [];

  displayedColumns: string[] = ['Milestone_Title', 'Milestone_Status', 'Milestone_Desc', 'Milestone_Case', 'Milestone_DueDate', 'ThreeDots'];
  dataSource = new MatTableDataSource<milestone>();

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getMilestone();
  }

  getMilestone() {
    this.api.UniCall(
      {
        CommandText: 'egsQAMilestoneGet',
        Params: [
          {
            Param: '@Milestone_ID',
            Value: null
          }
        ]
      }
    ).subscribe(value => {
      this.milestones = value[0];
      this.dataSource = new MatTableDataSource<milestone>(this.milestones);
    });
  }

  openDeleteModal(id: string, title: string) {
    this.Milestone_ID = id;
    this.Milestone_Title = title;
  }

  deleteMilestone() {
    this.api.UniCall(
      {
        CommandText: 'egsQAMilestoneDelete',
        Params: [
          {
            Param: '@Milestone_ID',
            Value: this.Milestone_ID.toString()
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }
}
