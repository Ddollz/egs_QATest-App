import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  accountlist$!: Observable<any[]>;

  showHead: boolean = false;
  showSide: boolean = false;

  constructor(private api: ApiService, private router: Router) {
    // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/register') {
          this.showHead = false;
          this.showSide = false;
        }else if (event['url'] == '/workspace' ){
          this.showSide = true;
          this.showHead = true;
        }else {
          this.showHead = true;
        }
      }
    });

    //theme toggle
    document.body.classList.toggle("light-theme");
  }



  ngOnInit(): void {

    //Sample Post Methos
    this.accountlist$ = this.api.getAccountList();
    this.accountlist$.subscribe({
      next(num) { console.log(num); },
      error(err) {
        console.log(err);
      },
      complete() { console.log('Finished sequence'); }
    })
    console.log(this.accountlist$);

  }
}
