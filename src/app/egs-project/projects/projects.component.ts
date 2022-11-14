import { Component, OnInit } from '@angular/core';
import { project } from '../../models/project/project.model';
import { ApiService } from '../../services/api.service';
import { reloadPage } from '../../services/global-functions.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatRadioChange } from '@angular/material/radio';
import {enableProdMode} from '@angular/core';

enableProdMode();



@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  Project_ID: string = '';
  Project_Name: string = '';
  Project_Code: string = '';
  Project_Description: string = '';
  Project_AccessType: string = '';
  statusSelect: string = 'Multiple';
  roleSelect: string = 'Multiple';
  defectsSelect: string = '';
  testSelect: string = '';
  milestonesSelect: string = '';
  memberSelect: string = '';
  filterDefectsText: any;
  filterStatusText: any;
  filterOptions: any;
  filterTestText: any;
  filterMilestonesText: any;
  filterMemberText: any;
  public show:boolean = true;
  hide = true;
  hideDefects = true;
  hideTest = true;
  hideMilestones = true;
  hideMember = true;
  hideAddFilter = true;
  n: any;

  projects: project[] = [];

  displayedColumns: string[] = ['Project_Image', 'Project_Name', 'Unresolved', 'TestRun', 'Milestone', 'Members', 'Setting'];
  dataSource = new MatTableDataSource<project>();

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getProject();
    this.filterStatusText = document.querySelector('#filter-status');
    this.filterDefectsText = document.querySelector('#filter-defects');
    this.filterOptions = document.querySelector('#status');
    this.filterTestText = document.querySelector('#filter-test');
    this.filterMilestonesText = document.querySelector('#filter-milestones');
    this.filterMemberText = document.querySelector('#filter-member');

  }

  getProject() {
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: ''
          }
        ],
      }
    ).subscribe(value => {
      for (let index = 0; index < value[0].length; index++) {
        if (value[0][index].Project_Status == 0)
          value[0][index].Project_Status = "Active";
        if (value[0][index].Project_Status == 1)
          value[0][index].Project_Status = "Archived";
      }
      this.projects = value[0];
      console.log(this.projects)
      this.dataSource = new MatTableDataSource<project>(this.projects);
    });
  }

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

  applyFilter(event?: Event, valueFilter?: MatRadioChange) {


    this.dataSource.filterPredicate = function (data, filter: string): boolean {

      return data.Project_Status.toString().includes(filter) === filter.trim().toLowerCase().includes(filter)
        ||data.Project_Name.toLowerCase().includes(filter)    
      ;
    };
    if (event != null) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

    } else if (valueFilter != null) {

      this.dataSource.filter = valueFilter.value;

    }
  }

  changeDropdownText() {
    //Status
    if (this.statusSelect == 'Active')
      this.filterStatusText.innerHTML = 'Active';
    else if (this.statusSelect == 'Archived')
      this.filterStatusText.innerHTML = 'Archived';
    else
      this.filterStatusText.innerHTML = 'Multiple';
    //Defects
    if (this.defectsSelect == 'Without defects')
      this.filterDefectsText.innerHTML = 'Without defects';
    else if (this.defectsSelect == 'Has defects')
      this.filterDefectsText.innerHTML = 'Has defects';
    else {
      this.filterDefectsText.innerHTML = '';
    }
    //Test runs
    if (this.testSelect == 'Without runs')
      this.filterTestText.innerHTML = 'Without runs';
    else if (this.testSelect == 'Has active runs')
      this.filterTestText.innerHTML = 'Has active runs';
    else if (this.testSelect == 'Has any runs')
      this.filterTestText.innerHTML = 'Has any runs';
    else {
      this.filterTestText.innerHTML = '';
    }
    //Milestones
    if (this.milestonesSelect == 'Without milestones')
      this.filterMilestonesText.innerHTML = 'Without milestones';
    else if (this.milestonesSelect == 'Has milestones')
      this.filterMilestonesText.innerHTML = 'Has milestones';
    else {
      this.filterMilestonesText.innerHTML = '';
    }
    //Member
}


  setLocalstorage(id: string) {
    localStorage.setItem('currentProjectID', id);
    console.log(localStorage.getItem('currentProjectID'));
  }

  toggle(n: number) {
    if (n == 1){
      if (this.hideDefects == true){
        this.hideDefects = false
      }
      else{
        this.hideDefects = true
      }
    }

    if (n == 2){
      if (this.hideTest == true){
        this.hideTest = false
      }
      else{
        this.hideTest = true
      }
    }

    if (n == 3){
      if (this.hideMilestones == true){
        this.hideMilestones = false
      }
      else{
        this.hideMilestones = true
      }
    }

    if (n == 4){
      if (this.hideMember == true){
        this.hideMember = false
      }
      else{
        this.hideMember = true
      }
    }

    if ( this.hideDefects == false && this.hideMilestones == false && this.hideTest == false && this.hideMember == false){
      this.hideAddFilter = false;
    }
    else{
      this.hideAddFilter = true;
    }
  }
}

