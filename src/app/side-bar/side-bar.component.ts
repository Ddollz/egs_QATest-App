import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  ddWorkspace: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  toggleCollapse(Dropdown__Name: string) {
    if (Dropdown__Name == "workspace") {
      this.ddWorkspace = !this.ddWorkspace;
    }
  }
}
