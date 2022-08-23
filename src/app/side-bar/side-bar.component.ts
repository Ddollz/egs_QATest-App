import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  ddWorkspace: boolean = true;
  ddExecution: boolean = true;
  ddSecurity: boolean = true;
  ddIssue: boolean = true;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }
}
