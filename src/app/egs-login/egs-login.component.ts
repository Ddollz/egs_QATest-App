import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-egs-login',
  templateUrl: './egs-login.component.html',
  styleUrls: ['./egs-login.component.css']
})
export class EgsLoginComponent implements OnInit {

  @HostBinding('class') classes = 'container d-flex justify-content-center align-items-center';

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
  });

  constructor() { }

  ngOnInit(): void {
  }

  loginSubmitted(){
    console.log(this.loginForm)
  }
  get Email(): FormControl{
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl{
    return this.loginForm.get('pwd') as FormControl;
  }
}
