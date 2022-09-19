import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { defect, defectComment } from '../../../../models/project/project.model';
import { ActivatedRoute } from '@angular/router';
import { reloadPage } from '../../../../services/global-functions.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-defect-view',
  templateUrl: './defect-view.component.html',
  styleUrls: ['./defect-view.component.css']
})
export class DefectViewComponent implements OnInit {

  index: number = 0;

  Defect_ID: string = '';
  Defect_Title: string = '';
  Defect_ActualResult: string = '';
  Defect_Milestone: string = '';
  Defect_Severity: string = '';
  Defect_Assignee: string = '';
  Defect_Author: string = '';
  Defect_Status: string = '';
  Defect_Status2: string = '';
  Defect_DateCreated: string = '';

  defects: defect[] = [];

  Comment_Content: string = '';
  Comment_Date: string = '';
  User_ID: string = '1';
  Case_ID: string = '1';

  defectComments: defectComment[] = [];

  statusTitle: string = '';

  constructor(private api: ApiService, private route: ActivatedRoute, @Inject(LOCALE_ID) private locale: string) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['i']) {
      this.index = this.route.snapshot.params['i'];
      this.getDefect();
    }
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
      this.Defect_Severity = value[0][this.index].Defect_Severity;
      this.Defect_Assignee = value[0][this.index].Defect_Assignee;
      this.Defect_Author = value[0][this.index].Defect_Author;
      this.Defect_Status = value[0][this.index].Defect_Status;
      this.Defect_DateCreated = value[0][this.index].Defect_DateCreated;
      this.getDefectComment();
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

  insertComment() {
    this.Comment_Date = new Date().toString();
    this.Comment_Date = formatDate(Date.now(),'yyyy-MM-dd HH:mm:ss', this.locale);

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
    this.Defect_Status2 = status.toString();
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
            Value: this.Defect_Status2
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

}
