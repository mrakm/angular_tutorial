import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthDialogActions } from '../../../auth-dialog-actions.enum';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  onRegisterSuccess(): void {
    this.close();
    this.openSnackBar('You are successfully registered', 'OK');
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  onTriggerSignin(): void {
    this.close();
    this.data.action$.next(AuthDialogActions.TRIGGER_SIGN_IN);
  }

  onTriggerForgetPassword(): void {
    this.close();
    this.data.action$.next(AuthDialogActions.TRIGGER_FORGET_PASSWORD);
  }
}
