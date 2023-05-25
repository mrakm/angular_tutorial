import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, NotificationService } from '../../../../core';
import { Notification } from '../../../../core/services/notification/notification.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() isDialog = false;
  @Input() hideLogin = false;
  @Input() infoMessage = undefined;
  @Input() email = undefined;
  @Input() hideLawyerSignup = false;
  @Output() readonly registerSuccess = new EventEmitter<boolean>();
  @Output() readonly triggerForgetPassword = new EventEmitter<boolean>();
  @Output() readonly triggerSignin = new EventEmitter<boolean>();
  @Input() registeredFrom: string;

  signUpForm: FormGroup;
  alertText: string;
  currentUrl: string;
  registerInProgress = false;
  loggedInUserSubscription: Subscription;
  validateEmail = true;
  registerText = 'authentication.signup.register';
  isLawyerSubscription: Subscription;
  emailSubscription: Subscription;
  invalidEmails: { [key: string]: string } = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.email) {
      this.signUpForm.get('email').setValue(this.email);
      this.signUpForm.get('email').disable();
    }
  }

  createForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, this.matchOtherValidator('password')])
    });

    this.emailSubscription = this.signUpForm.controls.email.valueChanges.subscribe(value => {
      if (this.invalidEmails[value]) {
        this.validateEmail = false;
        this.registerText = 'authentication.signup.override_register';
        this.alertText = this.invalidEmails[value];
      } else {
        this.validateEmail = true;
        this.registerText = 'authentication.signup.register';
      }
    });
  }

  // Convenience getter for easy access to form fields.
  get form(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  signUp(): void {
    this.registerInProgress = true;
    const item = {
      userName: this.form.email.value,
      password: this.form.password.value,
      application: 'Client',
      isSuperUser: false
    };

    // this.authService
    //   .register(item)
    //   .pipe(first())
    //   .subscribe(
    //     (client: any) => {
    //       this.registerInProgress = false;
    //       this.alertText = '';
    //     },
    //     ({ error, status }) => {
    //       this.registerInProgress = false;
    //       // user already exists
    //       if (status === 403) {
    //         this.alertText = 'This email is already taken!';
    //       } else if (status === 404) {
    //         this.alertText = 'This link is incorrect!';
    //       } else if (status === 422 && error.meta.type === 'email_validation') {
    //         this.invalidEmails[this.form.email.value] = error.error;
    //         this.registerText = 'authentication.signup.override_register';
    //         this.validateEmail = false;
    //         this.alertText = error.message;
    //       } else {
    //         this.alertText = error.message;
    //       }
    //     },
    //     () => {
    //       this.registerInProgress = false;
    //       this.registerSuccess.emit(true);
    //       this.gotoDashboard();
    //     }
    //   );
  }

  gotoDashboard(): void {
    this.router.navigate(['/a/d/product']);
  }

  signIn(event: MouseEvent): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerSignin.emit(true);
    }
  }

  matchOtherValidator(otherControlName: string): ValidatorFn {
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
