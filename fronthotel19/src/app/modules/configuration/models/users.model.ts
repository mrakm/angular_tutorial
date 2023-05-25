import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core';

export class UsersModel {
  static attributesLabels = {
    userName: 'User Name',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    role: 'Role',
    employee: 'Employee',
    application: 'Application',
    isActive: 'Active'
  };

  id?: string;
  name: string;
  menu: any;
  labLocationId: any;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(private readonly authService?: AuthService) {}

  validationRules?(): any {
    return {
      userName: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      roleId: new FormControl('', [Validators.required]),
      roleFilterCtrl: new FormControl(''),
      employeeId: new FormControl('', [Validators.required]),
      contractorId: new FormControl(''),
      labLocationId: new FormControl(),
      employeeFilterCtrl: new FormControl(''),
      contractorFilterCtrl: new FormControl(''),
      isSuperUser: new FormControl(false, [Validators.required]),
      isActive: new FormControl(true, [Validators.required]),
      userType: new FormControl('Employee')
      // application: new FormControl(this.authService.getClientApplication(), [Validators.required])
    };
  }
}
