import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { sharedStep } from 'src/app/models/project/project.model';
import { ApiService } from '../../../services/api.service';
import { reloadPage } from '../../../services/global-functions.service';

@Component({
  selector: 'app-shared-steps',
  templateUrl: './shared-steps.component.html',
  styleUrls: ['./shared-steps.component.css']
})
export class SharedStepsComponent implements OnInit {

  SharedStep_ID: string = '';
  SharedStep_Title: string = '';

  //Table Initialize
  sharedSteps: sharedStep[] = [];
  displayedColumns: string[] = ['Title', 'AttachedTo', 'ThreeDots'];
  dataSource = new MatTableDataSource<sharedStep>();

  constructor(private api: ApiService) {
    this.api.UniCall(
      {
        CommandText: 'egsQASharedStepGet',
        Params: [
          {
            Param: '@SharedStep_ID',
            Value: null
          }
        ]
      }
    ).subscribe(value => {
      this.sharedSteps = value[0];
      this.dataSource = new MatTableDataSource<sharedStep>(this.sharedSteps);
      console.log(this.sharedSteps)
    });
  }

  ngOnInit(): void {}

  openDeleteModal(id: string, title: string) {
    this.SharedStep_ID = id;
    this.SharedStep_Title = title;
  }

  deleteSharedStep() {
    console.log(this.SharedStep_ID);
    this.api.UniCall(
      {
        CommandText: 'egsQASharedStepDelete',
        Params: [
          {
            Param: '@SharedStep_ID',
            Value: this.SharedStep_ID.toString()
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
      return data.SharedStep_Title.toLowerCase().includes(filter) == filter.trim().toLowerCase().includes(filter);
    }
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
}
