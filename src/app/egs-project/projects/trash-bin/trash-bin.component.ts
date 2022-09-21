import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { sidebarService } from 'src/app/services/global-functions.service';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'aaaa', name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 'aaaa', name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 'aaaa', name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 'aaaa', name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 'aaaa', name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 'aaaa', name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 'aaaa', name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 'aaaa', name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 'aaaa', name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 'aaaa', name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-trash-bin',
  templateUrl: './trash-bin.component.html',
  styleUrls: ['./trash-bin.component.css']
})
export class TrashBinComponent implements OnInit {
  projectID: number = 0;
  displayedColumns: string[] = ['select','testcase', 'deleted', 'steps', 'testruns', 'control'];
  dataSource = ELEMENT_DATA;
  constructor(public sidebarServ: sidebarService, private activatedRoute: ActivatedRoute) {
    this.projectID = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.sidebarServ.fetchProjectID(this.projectID);
  }

  ngOnInit(): void {
  }

}
