import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { defect } from '../../../../models/project/project.model';
import { Router, ActivatedRoute } from '@angular/router';
import { reloadPage } from '../../../../services/global-functions.service';

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

  statusTitle: string = '';

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

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
