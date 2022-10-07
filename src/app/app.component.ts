import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ApiService } from './services/api.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  roleList$!: Observable<any[]>;

  showHead: boolean = false;
  showSide: boolean = false;

  constructor(private api: ApiService, public router: Router) {
    //theme toggle
    document.body.classList.toggle("light-theme");
  }
  ngOnInit(): void {

    //Sample Post Methods
    // this.api.UniCall(
    //   {
    //     CommandText: 'egsQARoleGet',
    //     Params: [
    //       {
    //         Param: '@Role_ID',
    //         Value: ''
    //       }

    //     ],
    //   }
    // ).subscribe({
    //     next(num) { console.log(num); },
    //     error(err) {
    //       console.log(err);
    //     },
    //     complete() { console.log('Finished sequence'); }
    //   })
  }
}
