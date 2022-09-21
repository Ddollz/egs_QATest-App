import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { project } from '../../models/project/project.model';
import { reloadPage } from '../../services/global-functions.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  //Update and Insert Variables
  Project_ID: string = '';
  Project_Name: string = '';
  Project_Code: string = '';
  Project_Description: string = '';
  Project_AccessType: string = '';

  //Table Initialize
  projects: project[] = [];
  displayedColumns: string[] = ['Favorite', 'Project_Image', 'Project_Name', 'Unresolved', 'TestRun', 'Milestone', 'Members', 'Setting'];
  dataSource = new MatTableDataSource<project>();

  constructor(private api: ApiService) {
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
    });
  }

  ngOnInit(): void { }

  openUpdateModal(id: string, name: string, desc: string, code: string, access: string) {
    this.Project_ID = id;
    this.Project_Name = name;
    this.Project_Description = desc;
    this.Project_Code = code;
    this.Project_AccessType = access.toString();
  }

  updateSettings() {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectInsertUpdate',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          },
          {
            Param: '@Project_Name',
            Value: this.Project_Name
          },
          {
            Param: '@Project_Code',
            Value: this.Project_Code
          },
          {
            Param: '@Project_Desc',
            Value: this.Project_Description
          },
          {
            Param: '@Project_AccessType',
            Value: this.Project_AccessType
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

  openDeleteModal(id: string, name: string) {
    this.Project_ID = id;
    this.Project_Name = name;
  }

  deleteProject() {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectDelete',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.Project_ID.toString()
          }
        ]
      }
    ).subscribe({
      error: (e) => console.error(e),
      complete: () => reloadPage()
    });
  }

  applyFilter(event?: Event) {
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.Project_Name.toLowerCase().includes(filter) == filter.trim().toLowerCase().includes(filter);
    }
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  setLocalstorage(id: string) {
    localStorage.setItem('currentProjectID', id);
    console.log(localStorage.getItem('currentProjectID'));
  }
}
