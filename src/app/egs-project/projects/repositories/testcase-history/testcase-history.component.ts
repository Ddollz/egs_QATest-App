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
  @Input() testCase: any = {};
  @Input() noChanges: any;
  currentattachements: any;
  prevattachements: any;
  testcaseattachements: any;
  constructor(public GFS: GlobalFunctionsService, private api: ApiService) {
  }

  ngOnInit(): void {

    if (this.currentObj != undefined) {
      var Params =
        [

          {
            Param: '@StartDate',
            Value: this.currentObj.SysStartTime.toString()
          }, {
            Param: '@EndDate',
            Value: this.currentObj.SysEndTime.toString()
          }

        ];

      var formData = new FormData();
      formData.append("CommandText", 'getAttachmentMasterHistory');
      formData.append("Params", JSON.stringify(Params));

      //? API CALL
      this.api.UniAttachmentlist(formData).subscribe({
        next: (result) => {
          if (result[0].length == 0) {
            this.currentattachements = undefined;
          } else
            this.currentattachements = result[0]

          console.log('curStart ' +this.currentObj.SysStartTime+' curEnd ' +this.currentObj.SysEndTime)
          console.log(result)
        },
        error: (msg) => {
          console.log(msg);
          alert("500 Internal Server Errors")
        }
      })

    }
    if (this.prevObj != undefined) {
      var Params =
        [

          {
            Param: '@StartDate',
            Value: this.prevObj.SysStartTime.toString()
          }, {
            Param: '@EndDate',
            Value: this.prevObj.SysEndTime.toString()
          }

        ];

      var formData = new FormData();
      formData.append("CommandText", 'getAttachmentMasterHistory');
      formData.append("Params", JSON.stringify(Params));

      //? API CALL
      this.api.UniAttachmentlist(formData).subscribe({
        next: (result) => {
          if (result[0].length == 0) {
            this.prevattachements = undefined;
          } else
            this.prevattachements = result[0]

          console.log('PrevStart ' +this.prevObj.SysStartTime+' PrevEnd ' +this.prevObj.SysEndTime)
          console.log(result)
        },
        error: (msg) => {
          console.log(msg);
          alert("500 Internal Server Errors")
        }
      })
    }

    if (Object.keys(this.testCase).length !== 0) {
      // console.log(this.testCase)
      var Params =
        [

          {
            Param: '@StartDate',
            Value: this.testCase.SysStartTime.toString()
          }, {
            Param: '@EndDate',
            Value: this.testCase.SysEndTime.toString()
          }, {
            Param: '@isFirst',
            Value: '1'
          }, {
            Param: '@Case_ID',
            Value: this.testCase.Case_ID.toString()
          }

        ];

      var formData = new FormData();
      formData.append("CommandText", 'getAttachmentMasterHistory');
      formData.append("Params", JSON.stringify(Params));

      //? API CALL
      this.api.UniAttachmentlist(formData).subscribe({
        next: (result) => {
          if (result[0].length == 0) {
            this.testcaseattachements = undefined;
          } else {
            this.testcaseattachements = result[0]
            console.log(this.testcaseattachements)
          }

          console.log('Testcase')
          console.log(result)
        },
        error: (msg) => {
          console.log(msg);
          alert("500 Internal Server Errors")
        }
      })
    }

  }

}
