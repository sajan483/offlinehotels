import { FormGroup, FormBuilder, Validators } from '@angular/forms'
export class loginAdapter {
  fb: FormBuilder;
  constructor() { }

  createLoginGroup(): FormGroup {
    this.fb = new FormBuilder();
    return this.fb.group({
      countryCode: [null, Validators.required],
      username: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  createForgotPassword(): FormGroup {
    this.fb = new FormBuilder();
    return this.fb.group({
      countryCode: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      otp: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    })
  }
}