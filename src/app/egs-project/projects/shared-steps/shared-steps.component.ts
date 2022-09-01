import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-steps',
  templateUrl: './shared-steps.component.html',
  styleUrls: ['./shared-steps.component.css']
})
export class SharedStepsComponent implements OnInit {

  displayedColumns: string[] = ['Title', 'AttachedTo', 'ThreeDots'];

  constructor() { }

  ngOnInit(): void {
  }

}
