import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleMode = new EventEmitter<boolean>();
  theme: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  toggle(value: boolean) {
    this.theme = !value;
    console.log(this.theme)
    this.toggleMode.emit(value);
  }

}
