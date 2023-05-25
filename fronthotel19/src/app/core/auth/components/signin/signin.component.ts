import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { fadeIn } from 'ng-animate';
import { first, take } from 'rxjs/operators';
import { GenericService } from 'src/app/shared/helper/generic.service';
import { AuthService } from '../../../../core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [trigger('fadeIn', [transition(':enter', useAnimation(fadeIn, { params: { timing: 0.5 } }))])]
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  alertText: string;
  loginInProgress = false;
  magicLinkProgress = false;
  projects: any;
  @Input() isDialog = false;
  @Output() readonly signInSuccess = new EventEmitter<boolean>();
  @Output() readonly triggerForgetPassword = new EventEmitter<boolean>();
  @Output() readonly triggerRegister = new EventEmitter<boolean>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly genericService: GenericService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getConfiguration();
  }

  getConfiguration(): void {
    this.genericService.__get('/project/findAll').subscribe(
      (projectRes: any) => {
        this.projects = projectRes;
        this.signInForm.controls.projectId.setValue(this.projects[0]);
      },
      error => {}
    );
  }

  createForm(): void {
    this.signInForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      otp: new FormControl(''),
      rememberMe: '',
      projectId: ''
    });
  }

  signIn(): void {
    this.loginInProgress = true;
    this.authService
      .login(this.signInForm.value.email, this.signInForm.value.password, this.signInForm.value.projectId)
      .pipe(first())
      .subscribe(
        (user: any) => {
          this.loginSuccess(user);
        },
        ({ error, status }) => {
          this.loginInProgress = false;
          this.signInForm.reset();
          if (status === 403) {
            this.alertText = 'Sorry, this email and password combination is incorrect.';
          } else {
            this.alertText = error.message;
          }
        },
        () => {
          this.loginInProgress = false;
          this.alertText = undefined;
          this.signInSuccess.emit(true);
        }
      );
  }

  get form(): { [key: string]: AbstractControl } {
    return this.signInForm.controls;
  }

  forgetPassword(event: MouseEvent): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerForgetPassword.emit(true);
    }
  }

  private loginSuccess(user: any): void {
    this.loginInProgress = false;
    this.redirectUser(user);
  }

  signUp(event: MouseEvent): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerRegister.emit(true);
    }
  }

  private redirectUser(user): void {
    this.router.navigate(['a/d/home']);
  }
}
