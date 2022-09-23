import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { suite } from '../../../../models/project/project.model';

@Component({
  selector: 'app-case-plan',
  templateUrl: './case-plan.component.html',
  styleUrls: ['./case-plan.component.css']
})
export class CasePlanComponent implements OnInit {

  @Input() Suite = {} as suite;
  @Input() projectID: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
