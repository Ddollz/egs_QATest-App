import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ApiService } from './services/api.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light-theme' | 'dark-theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  theme: Theme = 'light-theme';

  roleList$!: Observable<any[]>;

  showHead: boolean = false;
  showSide: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private api: ApiService, public router: Router
  ) {
    //theme toggle
    document.body.classList.toggle("light-theme");
  }
  ngOnInit(): void {
    this.initializeTheme();
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
  themeSwitch() {
    this.document.body.classList.replace(this.theme, this.theme === 'light-theme' ? (this.theme = 'dark-theme') : (this.theme = 'light-theme'))
  }
  initializeTheme = (): void => this.renderer.addClass(this.document.body, this.theme);
}
