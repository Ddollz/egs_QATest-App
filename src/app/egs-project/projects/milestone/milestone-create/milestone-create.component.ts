import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { milestone } from '../../../../models/project/project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-milestone-create',
  templateUrl: './milestone-create.component.html',
  styleUrls: ['./milestone-create.component.css']
})
export class MilestoneCreateComponent implements OnInit {

  //Update and Insert Variables
  Milestone_ID: string = '';
  Milestone_Title: string = '';
  Milestone_Status: string = '';
  Milestone_Description: string = '';
  Milestone_DueDate: string = '';

  milestones: milestone[] = [];

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.Milestone_Status = "1"
  }

  updateInsertMilestone() {
    this.api.UniCall(
      {
        CommandText: 'egsQAMilestoneInsertUpdate',
        Params: [
          {
            Param: '@Milestone_ID',
            Value: this.Milestone_ID
          },
          {
            Param: '@Milestone_Title',
            Value: this.Milestone_Title
          },
          {
            Param: '@Milestone_Status',
            Value: this.Milestone_Status
          },
          {
            Param: '@Milestone_Desc',
            Value: this.Milestone_Description
          },
          {
            Param: '@Milestone_DueDate',
            Value: this.Milestone_DueDate
          }
        ]
      }
    ).subscribe({
      next: (v) => this.router.navigate(["/projects/milestone"]),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }
}
