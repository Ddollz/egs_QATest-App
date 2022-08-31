import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-egs-registration',
  templateUrl: './egs-registration.component.html',
  styleUrls: ['./egs-registration.component.css']
})
export class EgsRegistrationComponent implements OnInit {
  loginForm!: FormGroup;


  @HostBinding('class') classes = 'container d-flex justify-content-center align-items-center';
  constructor(private formbuilder: FormBuilder, private api: ApiService, public router: Router) {
    this.loginForm = this.formbuilder.group(
      {
        email: new FormControl("", [Validators.required, Validators.email]),
        RoleTitle: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
        Fname: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
        Lname: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
        pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
        rpwd: new FormControl("", [Validators.required]),
      }
      , {
        validators: this.mustMatch("pwd", "rpwd")
      })
  }

  ngOnInit(): void {
  }
  mustMatch(pwd: string, rwpd: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[pwd];
      const controlMatch = formGroup.controls[rwpd];
      if (controlMatch.errors && !controlMatch.errors['mustMatch']) {
        return
      }
      if (control.value !== controlMatch.value) {
        controlMatch.setErrors({ mustMatch: true });
      } else {
        controlMatch.setErrors(null);
      }
    }
  }
  loginSubmitted() {
    console.log(this.loginForm.controls['email'].value)
    let tempVal = true;
    var account =
    {
      user_email: this.loginForm.controls['email'].value,
      user_Firstname: this.loginForm.controls['Fname'].value,
      user_LastName: this.loginForm.controls['Lname'].value,
      password: this.loginForm.controls['pwd'].value,
      user_isAdmin: -1,
      user_Status: -1,
      role_ID: 3,
      roleTitle: this.loginForm.controls['RoleTitle'].value
    }
    this.api.RegisterCall(account).subscribe({
      next(result: any) {
        console.log(result);
      },
      error(msg) {
        console.log(msg);
        alert("500 Internal Server Errors")
        tempVal = false;
      }
    })
    if (tempVal)
      this.router.navigate(['login']);
  }
  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get RoleTitle(): FormControl {
    return this.loginForm.get('RoleTitle') as FormControl;
  }
  get Fname(): FormControl {
    return this.loginForm.get('Fname') as FormControl;
  }
  get Lname(): FormControl {
    return this.loginForm.get('Lname') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
  get RPWD(): FormControl {
    return this.loginForm.get('rpwd') as FormControl;
  }
}
