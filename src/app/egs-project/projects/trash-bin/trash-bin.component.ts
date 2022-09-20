import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { sidebarService } from 'src/app/services/global-functions.service';

@Component({
  selector: 'app-trash-bin',
  templateUrl: './trash-bin.component.html',
  styleUrls: ['./trash-bin.component.css']
})
export class TrashBinComponent implements OnInit {
  projectID: number = 0;

  constructor(public sidebarServ: sidebarService, private activatedRoute: ActivatedRoute) {
    this.projectID = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.sidebarServ.fetchProjectID(this.projectID);
  }

  ngOnInit(): void {
  }

}
