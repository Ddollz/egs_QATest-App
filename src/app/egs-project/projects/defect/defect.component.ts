import { Component, OnInit } from '@angular/core';
import { defect, milestone } from '../../../models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { reloadPage } from '../../../services/global-functions.service';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.css']
})
export class DefectComponent implements OnInit {

  Defect_ID: string = '';
  Defect_Title: string = '';
  Defect_ActualResult: string = '';
  Defect_Milestone: string = '';
  Defect_Severity: string = '';
  Defect_Assignee: string = '';
  Defect_Author: string = '';
  Defect_Status: string = '';
  Defect_DateCreated: string = '';

  //Table Initialize
  defects: defect[] = [];
  displayedColumns: string[] = ['Status', 'Defect', 'Author', 'Assignee', 'Severity', 'Milestone', 'External', 'ThreeDots'];
  dataSource = new MatTableDataSource<defect>();

  milestones: milestone[] = [];

  statusTitle: string = '';

  constructor(private api: ApiService) {
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
      this.dataSource = new MatTableDataSource<defect>(this.defects);
    });

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

  ngOnInit(): void {}

  getDaysAgo(date: Date) {
    return "Created at some point in the past";
  }

  openDeleteModal(id: string, title: string) {
    this.Defect_ID = id;
    this.Defect_Title = title;
  }

  deleteDefect() {
    console.log(this.Defect_ID)
    this.api.UniCall(
      {
        CommandText: 'egsQADefectDelete',
        Params: [
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
    this.Defect_Status = status.toString();
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
            Value: this.Defect_Status
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

  applyFilter(event?: Event) {
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.Defect_Title.toLowerCase().includes(filter) == filter.trim().toLowerCase().includes(filter);
    }
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
}
