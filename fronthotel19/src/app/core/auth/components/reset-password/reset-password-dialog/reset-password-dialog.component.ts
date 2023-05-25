import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  onResetSuccess(): void {
    this.close();
    this.openSnackBar('Password updated', 'OK');
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
