import { Component, Input, OnInit } from '@angular/core';
import { project, suite } from '../../../../models/project/project.model';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.css']
})
export class SuiteComponent implements OnInit {
  @Input() Suite = {} as suite;

  @Input() isChild: boolean = false;
  @Input() countTab: number = 0;

  carretOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  suiteOpen(event: Event) {
    var element = event.target as HTMLElement;
    if (element.tagName != "I" || element.tagName != "I")
      this.carretOpen = !this.carretOpen

    console.log(this.Suite);
  }

}
