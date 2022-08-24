import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.css']
})
export class SuiteComponent implements OnInit {

  carretOpen: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  suiteOpen(event: Event) {
    var element = event.target as HTMLElement;
    if (element.tagName != "I")
      this.carretOpen = !this.carretOpen
  }

}
