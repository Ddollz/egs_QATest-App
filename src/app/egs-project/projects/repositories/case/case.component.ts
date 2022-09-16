import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { suite } from '../../../../models/project/project.model';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {
  @Input() Suite = {} as suite;
  @Input() projectID: number = 0;

  @Output() createNewEvent = new EventEmitter<number>();
  @Output() editNewEvent = new EventEmitter<number>();
  @Output() newDeleteEvent = new EventEmitter<number>();
  @Output() selectEvent = new EventEmitter<number>();

  @Input() checked: boolean = false;
  @Input() carretOpen: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }


  settingOpen(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    console.log("adwd")
  }

  editSuite(suiteUpdate: number) {
    this.editNewEvent.emit(suiteUpdate);
  }


  deleteSuite(suiteDelete: number) {
    this.newDeleteEvent.emit(suiteDelete);
  }
  checkbox(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    this.checked = !this.checked;
    this.selectEvent.emit(this.Suite.Suite_ID);
  }

}
