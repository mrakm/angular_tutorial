import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogService, AuthService } from '../../../core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  isGuest = false;
  user: any;
  constructor(private readonly authDialogService: AuthDialogService, private readonly authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.isGuest = !this.user.email;
  }

  openResetPasswordDialog(): void {
    this.authDialogService.openRsetPasswordDialog();
  }
}
