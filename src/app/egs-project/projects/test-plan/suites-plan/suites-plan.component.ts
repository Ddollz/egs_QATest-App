import { Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { project, suite } from '../../../../models/project/project.model';

@Component({
  selector: 'app-suites-plan',
  templateUrl: './suites-plan.component.html',
  styleUrls: ['./suites-plan.component.css']
})
export class SuitesPlanComponent implements OnInit {

  @Input() Suite = {} as suite;


  @Input() carretOpen: boolean = false;

  Modal_Title: string = "Edit suite";
  Modal_btn: string = "Save";

  @Output() newItemEvent = new EventEmitter<number>();
  @Output() newDeleteEvent = new EventEmitter<number>();
  @Output() createNewEvent = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  suiteOpen(event: Event) {
    var element = event.target as HTMLElement;
    // if (element.tagName != "I")
    //   this.carretOpen = !this.carretOpen

  }
  settingOpen(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }

  editSuite(suiteUpdate: number) {
    this.newItemEvent.emit(suiteUpdate);
  }

  deleteSuite(suiteDelete: number) {
    this.newDeleteEvent.emit(suiteDelete);
  }

  createChildSuite(suiteParent: number) {
    // console.log(suiteDelete);
    this.createNewEvent.emit(suiteParent);
  }

}
