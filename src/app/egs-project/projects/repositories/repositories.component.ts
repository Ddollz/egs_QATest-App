import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { project, suite } from '../../../models/project/project.model';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {
  Modal_Title: string = "Create suite";
  Modal_btn: string = "Create";

  suites: suite[] = [];

  constructor(private api: ApiService) {


    this.api.UniCall(
      {
        CommandText: 'egsQASuiteGet',
        Params: [
          {
            Param: '@Suite_ID',
            Value: null
          }
        ],
      }
    ).subscribe(value => {
      this.suites = value[0];
      console.log(this.suites)
    }
    );

  }

  ngOnInit(): void {
  }

}
