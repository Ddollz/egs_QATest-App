import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  //Utilities
  LinkParamID: number = 0;

  ddWorkspace: boolean = true;
  ddExecution: boolean = true;
  ddSecurity: boolean = true;
  ddIssue: boolean = true;
  constructor(public router: Router, private activatedRoute: ActivatedRoute) {
    console.log(activatedRoute);
  }

  ngOnInit(): void {
  }
}
