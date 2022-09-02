import { Component, OnInit } from '@angular/core';
import { milestone } from '../../../models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.css']
})
export class MilestoneComponent implements OnInit {

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

  ngOnInit(): void {
  }

}
