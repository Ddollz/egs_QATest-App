import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { defect, defectComment, milestone, project, step } from '../../../../models/project/project.model';
import { ActivatedRoute } from '@angular/router';
import { reloadPage } from '../../../../services/global-functions.service';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-defect-view',
  templateUrl: './defect-view.component.html',
  styleUrls: ['./defect-view.component.css']
})
export class DefectViewComponent implements OnInit {
  Project_ID: number;
  Project?: project;

  statusTitle: string = '';

  Defect_ID: string = '';
  Defect_Title: string = '';
  Defect_ActualResult: string = '';
  Defect_Milestone: number = 0;
  Defect_Severity: string = '';
  Defect_Assignee: string = '';
  Defect_Author: string = '';
  Defect_Status: string = '';
  Defect_StatusTemp: string = '';
  Defect_DateCreated: string = '';

  Comment_Content: string = '';
  Comment_Date: string = '';
  User_ID: string = '1';
  Case_ID: string = '1';


  defect: any;
  defectComments: defectComment[] = [];
  milestones: milestone[] = [];

  steps: step[] = [];
  displayedColumns: string[] = ['Step', 'Action', 'Input', 'Expected', 'Comment', 'Attachments', 'Status'];
  dataSource: any;

  constructor(private api: ApiService, private route: ActivatedRoute, @Inject(LOCALE_ID) private locale: string) {
    this.Project_ID = Number(localStorage.getItem('currentProjectID'));

    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.Project = value[0][0];

      if (this.route.snapshot.params['id']) {
        this.Defect_ID = this.route.snapshot.params['id'];
        this.getDefect();
        this.getDefectComment();
        this.getMilestone();
      }
      console.log(this.Project)
    });
  }

  ngOnInit(): void {
  }

  getDefect() {
    this.api.UniCall(
      {
        CommandText: 'egsQADefectGet',
        Params: [
          {
            Param: '@Defect_ID',
            Value: this.Defect_ID
          }
        ]
      }
    ).subscribe(value => {
      this.defect = value[0][0];
      this.Defect_ID = value[0][0].Defect_ID;
      this.Defect_Title = value[0][0].Defect_Title;
      this.Defect_ActualResult = value[0][0].Defect_ActualResult;
      this.Defect_Milestone = value[0][0].Defect_Milestone;
      this.Defect_Severity = value[0][0].Defect_Severity;
      this.Defect_Assignee = value[0][0].Defect_Assignee;
      this.Defect_Author = value[0][0].Defect_Author;
      this.Defect_Status = value[0][0].Defect_Status;
      this.Defect_DateCreated = value[0][0].Defect_DateCreated;
      console.log(this.defect)
      this.api.UniCall(
        {
          CommandText: 'egsQATestRunStepsGet',
          Params: [
            {
              Param: '@Case_ID',
              Value: this.defect.Case_ID.toString()
            }, {
              Param: '@TestRun_ID',
              Value: this.defect.TestRun_ID.toString()
            }
          ],
        }
      ).subscribe(value => {
        if (!value[0]) {
          this.steps = []
          return
        }
        this.steps = value[0];
        this.dataSource = new MatTableDataSource<any>(this.steps);
        console.log(this.steps)
      });

    });
  }

  getDefectComment() {
    this.api.UniCall(
      {
        CommandText: 'egsQADefectCommentGet',
        Params: [
          {
            Param: '@Defect_ID',
            Value: this.Defect_ID.toString()
          }
        ]
      }
    ).subscribe(value => {
      this.defectComments = value[0];
    });
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
    });
  }

  formatDate(date: string) {
    return date.substring(0, 10) + ' ' + date.substring(11, 21);
  }

  insertComment() {
    this.Comment_Date = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);

    this.api.UniCall(
      {
        CommandText: 'egsQADefectCommentInsertUpdate',
        Params: [
          {
            Param: '@Comment_Content',
            Value: this.Comment_Content
          },
          {
            Param: '@Comment_Date',
            Value: this.Comment_Date
          },
          {
            Param: '@User_ID',
            Value: this.User_ID
          },
          {
            Param: '@Case_ID',
            Value: this.Case_ID
          },
          {
            Param: '@Defect_ID',
            Value: this.Defect_ID.toString()
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

  openStatusModal(id: string, status: number) {
    if (status == 1) {
      this.statusTitle = 'Open';
    }
    if (status == 2) {
      this.statusTitle = 'In Progress';
    }
    else if (status == 3) {
      this.statusTitle = 'Invalid';
    }
    else if (status == 4) {
      this.statusTitle = 'Resolved';
    }

    this.Defect_ID = id;
    this.Defect_StatusTemp = status.toString();
  }

  changeStatus() {
    this.api.UniCall(
      {
        CommandText: 'egsQADefectInsertUpdate',
        Params: [
          {
            Param: '@Defect_ID',
            Value: this.Defect_ID.toString()
          },
          {
            Param: '@Defect_Status',
            Value: this.Defect_StatusTemp
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

  collapseChevronIcon(event: Event) {
    var dom = event.currentTarget as HTMLElement;
    console.log(dom);
    if (dom.querySelector('i')?.classList.contains('bi-chevron-down')) {
      dom.querySelector('i')?.classList.replace('bi-chevron-down', 'bi-chevron-up')
      dom.classList.add("show");
    }
    else {
      dom.querySelector('i')?.classList.replace('bi-chevron-up', 'bi-chevron-down')
      dom.classList.remove("show");

    }
  }

}
