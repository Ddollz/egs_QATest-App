import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

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

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  loginSubmitted() {
    console.log(this.loginForm)
    var loginAcc = {
      user_email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['pwd'].value,
    }
    this.api.LoginCall(loginAcc).subscribe(
      {
        next: (token) => (
          localStorage.setItem('authToken', token)
        ),
        error: (e) => (
          alert(e.error),
          console.log(e)
        ),
        complete: () => console.info('complete')
      }
    );
  }
  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
}
