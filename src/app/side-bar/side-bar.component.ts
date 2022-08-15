import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  ddWorkspace: boolean = true;
  ddSecurity: boolean = true;
  ddTests: boolean = true;
  ddExecution: boolean = true;
  ddIssues: boolean = true;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  toggleCollapse(Dropdown__Name: string) {
    if (Dropdown__Name == "workspace") {
      this.ddWorkspace = !this.ddWorkspace;
    } else if (Dropdown__Name == "security") {
      this.ddSecurity = !this.ddSecurity;
    } else if (Dropdown__Name == "tests") {
      this.ddTests = !this.ddTests;
    } else if (Dropdown__Name == "execution") {
      this.ddExecution = !this.ddExecution;
    } else if (Dropdown__Name == "issues") {
      this.ddIssues = !this.ddIssues;
    }
  }
}
