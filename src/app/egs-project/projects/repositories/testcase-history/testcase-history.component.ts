import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { user } from 'src/app/models/workspace/workspace.model';
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
  @Input() testCase: any = {};
  @Input() noChanges: any;


  user = {} as user;

  constructor(public GFS: GlobalFunctionsService, private api: ApiService) {
  }

  ngOnInit(): void {
    if (this.currentObj != null)
      this.api.UniCall(
        {
          CommandText: 'egsQAAccountGet',
          Params: [
            {
              Param: '@User_ID',
              Value: this.currentObj.LastModifiedUser.toString() //Project ID = 4
            }
          ],
        }
      ).subscribe({
        next: (e) => {
          this.user = e[0][0]
          console.log(this.user)
        }
      })
  }

}
