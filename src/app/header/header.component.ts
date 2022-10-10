import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleMode = new EventEmitter<string>();
  theme: string = 'light-theme';

  constructor() {
  }

  ngOnInit(): void {
  }
  toggle(value: string) {


    var localTheme = localStorage.getItem('theme');
    if (localTheme != undefined)
      if (localTheme == 'light-theme')
        this.theme = 'dark-theme'
      else
        this.theme = 'light-theme'
    else
      this.theme = 'light-theme'
    localStorage.setItem('theme', this.theme);
    this.toggleMode.emit(this.theme);

  }

}
