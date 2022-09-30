import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GlobalFunctionsService } from '../../../../services/global-functions.service';

@Component({
  selector: 'app-testcase-history',
  templateUrl: './testcase-history.component.html',
  styleUrls: ['./testcase-history.component.css']
})
export class TestcaseHistoryComponent implements OnInit {
  @Input() currentObj: any;
  @Input() prevObj: any;
  @Input() isLast: any;
  @Input() isFirst: any;
  @Input() index: any;
  @Input() testCase: any;
  @Input() noChanges: any;
  constructor(public GFS: GlobalFunctionsService, private api: ApiService) {
  }

  ngOnInit(): void {

  }

}
