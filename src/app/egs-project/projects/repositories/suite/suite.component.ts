import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { project, suite } from '../../../../models/project/project.model';
@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.css']
})
export class SuiteComponent implements OnInit {
  @Input() Suite = {} as suite;

  carretOpen: boolean = false;

  Modal_Title: string = "Edit suite";
  Modal_btn: string = "Save";

  @Output() newItemEvent = new EventEmitter<number>();
  @Output() newDeleteEvent = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  suiteOpen(event: Event) {
    var element = event.target as HTMLElement;
    if (element.tagName != "I")
      this.carretOpen = !this.carretOpen

  }
  settingOpen(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }

  editSuite(suiteUpdate: number) {
    this.newItemEvent.emit(suiteUpdate);
  }

  deleteSuite(suiteDelete: number) {
    // console.log(suiteDelete);
    this.newDeleteEvent.emit(suiteDelete);
  }
}
