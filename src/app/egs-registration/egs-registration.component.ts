import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-egs-registration',
  templateUrl: './egs-registration.component.html',
  styleUrls: ['./egs-registration.component.css']
})
export class EgsRegistrationComponent implements OnInit {
  loginForm!: FormGroup;


  @HostBinding('class') classes = 'container d-flex justify-content-center align-items-center';
  constructor(private formbuilder: FormBuilder) {
    this.loginForm = this.formbuilder.group(
      {
        email: new FormControl("", [Validators.required, Validators.email]),
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
    console.log(this.loginForm)
  }
  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
  get RPWD(): FormControl {
    return this.loginForm.get('rpwd') as FormControl;
  }
}
