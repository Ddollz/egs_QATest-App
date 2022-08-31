import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Location } from "@angular/common";

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']
})
export class CreatePlanComponent implements OnInit {

  constructor(private router: Router, private location: Location) { }

  ngOnInit(): void {
  }

}
