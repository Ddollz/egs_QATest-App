import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  constructor(private router: Router) { }
  backPage(url: any) {
    this.router.navigate([url])
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
      console.log(this.projectID)
    }
    this.selectedTitle.subscribe((value) => {
      this.projectID = value
    });
  }

  fetchProjectID(ID: any) {
    if (ID == null || ID == 0) {
      this.projectID = Number(localStorage.getItem('currentProjectID'));
      this.selectedTitle.next(this.projectID);
      console.log(this.projectID)
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
