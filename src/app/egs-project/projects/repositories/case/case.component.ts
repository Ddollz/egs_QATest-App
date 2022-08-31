import { Component, Input, OnInit } from '@angular/core';
import { suite } from '../../../../models/project/project.model';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {
  @Input() Suite = {} as suite;

  constructor() { }

  ngOnInit(): void {
  }


  settingOpen(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    console.log("adwd")
  }

}
