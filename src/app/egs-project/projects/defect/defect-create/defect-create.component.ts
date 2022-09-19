import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { milestone, defect } from '../../../../models/project/project.model';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-defect-create',
  templateUrl: './defect-create.component.html',
  styleUrls: ['./defect-create.component.css'],
})
export class DefectCreateComponent implements OnInit {

  index: number = 0;
  Page_title: string = 'Create defect';
  Button_title: string = 'Create defect';

  //Update and Insert Variables
  Defect_ID: string = '';
  Defect_Title: string = '';
  Defect_ActualResult: string = '';
  Defect_Milestone: string = '';
  Defect_Severity: string = '';
  Defect_Assignee: string = '';
  Defect_Author: string = '';
  Defect_Status: string = '1';
  Defect_DateCreated: string = '';

  defects: defect[] = [];
  milestones: milestone[] = [];

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, @Inject(LOCALE_ID) private locale: string) {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.Page_title = 'Edit defect';
      this.Button_title = 'Save';
      this.getDefect();
    }
    
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
    });

    this.Defect_DateCreated = new Date().toString();
    this.Defect_DateCreated = formatDate(Date.now(),'yyyy-MM-dd HH:mm:ss', this.locale);
  }

  ngOnInit(): void {
    // Default values
    this.Defect_Milestone = '0';
    this.Defect_Severity = '4';
    this.Defect_Assignee = '0';
  }

  getDefect() {
    this.api.UniCall(
      {
        CommandText: 'egsQADefectGet',
        Params: [
          {
            Param: '@WithAll',
            Value: 'true'
          }
        ]
      }
    ).subscribe(value => {
      this.defects = value[0];
      this.Defect_ID = value[0][this.index].Defect_ID;
      this.Defect_Title = value[0][this.index].Defect_Title;
      this.Defect_ActualResult = value[0][this.index].Defect_ActualResult;
      this.Defect_Milestone = value[0][this.index].Defect_Milestone;
      this.Defect_Severity = value[0][this.index].Defect_Severity.toString();
      this.Defect_Assignee = value[0][this.index].Defect_Assignee.toString();
      this.Defect_Author = value[0][this.index].Defect_Author;
      this.Defect_Status = value[0][this.index].Defect_Status;
      this.Defect_DateCreated = value[0][this.index].Defect_DateCreated;
    });
  }

  updateInsertDefect() {
    this.api.UniCall(
      {
        CommandText: 'egsQADefectInsertUpdate',
        Params: [
          {
            Param: '@Defect_ID',
            Value: this.Defect_ID.toString()
          },
          {
            Param: '@Defect_Title',
            Value: this.Defect_Title
          },
          {
            Param: '@Defect_ActualResult',
            Value: this.Defect_ActualResult
          },
          {
            Param: '@Defect_Milestone',
            Value: this.Defect_Milestone.toString()
          },
          {
            Param: '@Defect_Severity',
            Value: this.Defect_Severity
          },
          {
            Param: '@Defect_Assignee',
            Value: this.Defect_Assignee
          },
          {
            Param: '@Defect_Author',
            Value: this.Defect_Author
          },
          {
            Param: '@Defect_Status',
            Value: this.Defect_Status
          },
          {
            Param: '@Defect_DateCreated',
            Value: this.Defect_DateCreated
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => this.router.navigate(["/projects/defect"])
    });
  }
}
