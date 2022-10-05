import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { milestone } from '../../../../models/project/project.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-milestone-create',
  templateUrl: './milestone-create.component.html',
  styleUrls: ['./milestone-create.component.css']
})
export class MilestoneCreateComponent implements OnInit {

  Page_title: string = 'Create milestone';
  Button_title: string = 'Create milestone';

  Milestone_ID: string = '';
  Milestone_Title: string = '';
  Milestone_Status: string = '1';
  Milestone_Desc: string = '';
  Milestone_DueDate: string = '';

  milestones: milestone[] = [];

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.Milestone_ID = this.route.snapshot.params['id'];
      this.Page_title = 'Edit milestone';
      this.Button_title = 'Save';
      this.getMilestone();
    }
  }

  getMilestone() {
    this.api.UniCall(
      {
        CommandText: 'egsQAMilestoneGet',
        Params: [
          {
            Param: '@Milestone_ID',
            Value: this.Milestone_ID
          }
        ]
      }
    ).subscribe(value => {
      this.Milestone_ID = value[0][0].Milestone_ID;
      this.Milestone_Title = value[0][0].Milestone_Title;
      this.Milestone_Desc = value[0][0].Milestone_Desc;
      this.Milestone_Status = value[0][0].Milestone_Status.toString();
      this.Milestone_DueDate = value[0][0].Milestone_DueDate.substring(0,10);
    });
  }

  updateInsertMilestone() {
    this.api.UniCall(
      {
        CommandText: 'egsQAMilestoneInsertUpdate',
        Params: [
          {
            Param: '@Milestone_ID',
            Value: this.Milestone_ID.toString()
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
            Value: this.Milestone_Desc
          },
          {
            Param: '@Milestone_DueDate',
            Value: this.Milestone_DueDate
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["/projects/milestone"])
    });
  }
}
