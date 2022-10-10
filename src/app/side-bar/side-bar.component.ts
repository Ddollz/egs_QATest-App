import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { project } from '../models/project/project.model';
import { ApiService } from '../services/api.service';
import { sidebarService } from '../services/global-functions.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  //Utilities
  projectID: number = 0;
  _asideSubscription: any;
  project = {} as project;

  ddWorkspace: boolean = true;
  ddExecution: boolean = true;
  ddSecurity: boolean = true;
  ddIssue: boolean = true;
  constructor(private api: ApiService, public router: Router, private sidebarServ: sidebarService) {
    this.projectID = Number(localStorage.getItem('currentProjectID'));
    // console.log(this.projectID)
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@Project_ID',
            Value: this.projectID.toString() //? 4
          }
        ],
      }
    ).subscribe(value => {
      this.project = value[0][0];
    }
    );
  }

  ngOnInit(): void {
  }

  isActive(url: string): boolean {
    return this.router.url.includes(url);
  }
}
