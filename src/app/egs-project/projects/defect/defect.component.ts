import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.css']
})
export class DefectComponent implements OnInit {

  displayedColumns: string[] = ['Defect', 'Author', 'Assignee', 'Severity', 'Milestone', 'External', 'ThreeDots'];

  constructor() { }

  ngOnInit(): void {
  }

}
