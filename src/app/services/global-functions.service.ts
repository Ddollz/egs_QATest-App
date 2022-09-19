import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  constructor(private router: Router) { }
  backPage(url:any) {
    this.router.navigate([url])
  }
}

@Injectable({
  providedIn: 'root'
})
export class sidebarService {
  projectID: number = 1;
  selectedTitle: Subject<number> = new Subject<number>();

  constructor() {
    this.selectedTitle.subscribe((value) => {
      this.projectID = value
    });
  }

  fetchProjectID(ID: any) {
    this.projectID = ID
    this.selectedTitle.next(this.projectID);
  }
}

export function reloadPage() {
  window.location.reload();
}
