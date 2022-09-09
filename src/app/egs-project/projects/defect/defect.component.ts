import { Component, OnInit } from '@angular/core';
import { defect } from '../../../models/project/project.model';
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

  constructor(private api: ApiService) { 
    this.api.UniCall(
      {
        CommandText: 'egsQADefectGet',
        Params: [
          {
            Param: '@Defect_ID',
            Value: null
          }
        ]
      }
    ).subscribe(value => {
      this.defects = value[0];
      this.dataSource = new MatTableDataSource<defect>(this.defects);
    });
  }

  ngOnInit(): void {}

  openDeleteModal(id: string, title: string) {
    this.Defect_ID = id;
    this.Defect_Title = title;
  }

  deleteDefect() {
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

}
