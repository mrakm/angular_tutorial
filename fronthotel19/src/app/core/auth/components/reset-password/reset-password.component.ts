import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  alertText = '';
  digest;
  isFormVisible = false;
  isInvalidDigest = false;
  isDialog = false;
  error = false;

  @Input() withoutDigest = false;
  @Output() resetSuccess = new EventEmitter<boolean>();
  @Output() triggerSignin = new EventEmitter<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    if (this.withoutDigest) {
      this.isFormVisible = true;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.resetForm.controls;
  }

  createForm(): void {
    this.resetForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm: new FormControl('', [Validators.required, this.matchOtherValidator('password')])
    });

    if (this.withoutDigest) {
      this.resetForm.addControl('current_password', new FormControl('', [Validators.required]));
    }
  }

  onChangeInput(): void {
    this.form.confirm.setErrors(undefined);
    this.form.password.setErrors(undefined);
    this.form.confirm.updateValueAndValidity();
    this.form.password.updateValueAndValidity();
  }

  submit(): void {
    this.error = false;
    if (this.withoutDigest) {
      this.onUpdatePass();
    } else {
      this.onResetPass();
    }
  }

  onResetPass(): void {
    this.authService.reset(this.form.password.value, this.form.confirm.value, this.digest).subscribe(
      apiResponse => {
        const email = apiResponse.response;
        this.alertText = '';
        this.resetSuccess.emit();
        this.router.navigate(['/auth/login', { email }]);
      },
      error => {
        console.log(error);
      },
      () => { }
    );
  }

  onUpdatePass(): void {
    this.authService.updatePass(this.resetForm.value).subscribe(
      apiResponse => {
        this.resetSuccess.emit();
      },
      error => {
        console.log(error);
        this.error = true;
      }
    );
  }

  login($event): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerSignin.emit(true);
    }
  }

  private matchOtherValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const otherControl: AbstractControl = control.root.get(otherControlName);

      if (otherControl) {
        const subscription: Subscription = otherControl.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
          subscription.unsubscribe();
        });
      }

      return otherControl && control.value !== otherControl.value ? { match: true } : undefined;
    };
  }
}
