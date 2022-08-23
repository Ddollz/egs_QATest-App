import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  test: string = '';

  constructor(private router: Router, private api: ApiService) { 
    this.api.UniCall(
      {
        CommandText: 'egsQAProjectGet',
        Params: [
          {
            Param: '@User_ID',
            Value: '3'
          }
        ],
      }
    ).subscribe(value => {
      this.test = value[0][0].Project_Name;
    }
    );
  }

  ngOnInit(): void {
  }

  navigate() {
    this.router.navigate(['/projects/create']);
  }
}
