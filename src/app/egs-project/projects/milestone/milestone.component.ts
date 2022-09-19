import { Component, OnInit } from '@angular/core';
import { milestone } from '../../../models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { reloadPage } from '../../../services/global-functions.service';

@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.css']
})
export class MilestoneComponent implements OnInit {

  Milestone_ID: string = '';
  Milestone_Title: string = '';

  //Table Initialize
  milestones: milestone[] = [];
  displayedColumns: string[] = ['Title', 'Status', 'Description', 'Cases', 'DueDate', 'ThreeDots'];
  dataSource = new MatTableDataSource<milestone>();

  constructor(private api: ApiService) {
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

  ngOnInit(): void {}

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
