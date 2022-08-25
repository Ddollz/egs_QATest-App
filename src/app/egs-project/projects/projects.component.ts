import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { project } from '../../models/project/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  //Table Initialize
  projects: project[] = [];
  displayedColumns: string[] = ['Favorite', 'Project_Image', 'Project_Name', 'Unresolved', 'TestRun', 'Milestone', 'Members', 'Setting'];
  dataSource = new MatTableDataSource<project>();

  constructor(private router: Router, private api: ApiService) {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: null
          }
        ],
      }
    ).subscribe(value => {
      this.projects = value[0];
      this.dataSource = new MatTableDataSource<project>(this.projects);
    }
    );
  }

  ngOnInit(): void { }

  navigate() {
    this.router.navigate(['/projects/create']);
  }

  updateSettings() {

  }

  deleteProject() {

  }
}
