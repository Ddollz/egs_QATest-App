import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  constructor() { }


  SeverityToText(value: number) {
    if (value === 1) return 'Not set'
    if (value === 2) return 'Blocker'
    if (value === 3) return 'Critical'
    if (value === 4) return 'Major'
    if (value === 5) return 'Normal'
    if (value === 6) return 'Minor'
    if (value === 7) return 'Trival'
    else return 'Not set'
  }
  PriorityToText(value: number) {
    if (value === 1) return 'Not set'
    if (value === 2) return 'High'
    if (value === 3) return 'Medium'
    if (value === 4) return 'Low'
    else return 'Not set'
  }

  LayerToText(value: number) {
    if (value === 1) return 'Not set'
    if (value === 2) return 'E2E'
    if (value === 3) return 'API'
    if (value === 4) return 'Unit'
    else return 'Not set'
  }
  FlakyToText(value: number) {
    if (value === 1) return 'No'
    if (value === 2) return 'Yes'
    else return 'No'
  }
  BehaviorToText(value: number) {
    if (value === 1) return 'Not set'
    if (value === 2) return 'Positive'
    if (value === 3) return 'Negative'
    if (value === 4) return 'Destructive'
    else return 'Not set'
  }
  AutomationToText(value: number) {
    if (value === 1) return 'Not automated'
    if (value === 2) return 'To be automated'
    if (value === 3) return 'Automated'
    else return 'Not automated'
  }

}

@Injectable({
  providedIn: 'root'
})
export class sidebarService {
  projectID: number = 0; //4
  selectedTitle: Subject<number> = new Subject<number>();

  constructor() {

    if (this.projectID == 0) {
      this.projectID = Number(localStorage.getItem('currentProjectID'));
      this.selectedTitle.next(this.projectID);
      // console.log(this.projectID)
    }
    this.selectedTitle.subscribe((value) => {
      this.projectID = value
    });
  }

  fetchProjectID(ID: any) {
    if (ID == null || ID == 0) {
      this.projectID = Number(localStorage.getItem('currentProjectID'));
      this.selectedTitle.next(this.projectID);
      // console.log(this.projectID)
    } else {
      this.projectID = ID
      localStorage.setItem('currentProjectID', ID);
      this.selectedTitle.next(this.projectID);
    }
  }

}

export function reloadPage() {
  window.location.reload();
}
