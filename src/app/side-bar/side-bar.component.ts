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
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  toggleCollapse(Dropdown__Name: string) {
    if (Dropdown__Name == "workspace") {
      this.ddWorkspace = !this.ddWorkspace;
    } else if (Dropdown__Name == "security") {
      this.ddSecurity = !this.ddSecurity;
    }
  }
}
