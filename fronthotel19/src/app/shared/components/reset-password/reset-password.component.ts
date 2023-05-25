import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService, PNotifyService } from 'src/app/core';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  isLoading = false;
  pageAct: string;
  pnotify;
  fg = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    private readonly fb: FormBuilder,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    pNotifyService: PNotifyService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pnotify = pNotifyService.get();

  }

  ngOnInit(): void {

  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  saveData(item): void {
    this.isLoading = true;
    const id = this.authService.getClientId();
    this.userService.update(id, item).subscribe(
      () => {
        this.pnotify.success({
          title: 'Success!',
          text: 'Password has been changed.'
        });
        this.isLoading = false;
        this.onConfirm();
      },
      error => {
        this.pnotify.error({
          title: 'Oops!',
          text: error.error.message
        });
        this.isLoading = false;
      }
    );

  }

  isEqual(): boolean {
    if (this.fg.get('password').value !== this.fg.get('confirmPassword').value) {
      this.fg.get('confirmPassword').setErrors({ 'not-equal': true });

      return false;
    }
  }

}
