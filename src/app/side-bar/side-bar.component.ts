import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  ddWorkspace: boolean = true;
  ddExecution: boolean = true;
  ddSecurity: boolean = true;
  ddIssue: boolean = true;
  constructor(public router: Router, private sidebarServ: sidebarService) {
    this.projectID = Number(localStorage.getItem('currentProjectID'));
    console.log(this.projectID)
  }

  ngOnInit(): void {
  }

  isActive(url: string): boolean {
    return this.router.url.includes(url);
  }
}
