import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core';

export class RoleModel {
  static attributesLabels = {
    name: 'Role Name'
  };

  id?: string;
  name: string;
  menu: any;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(private readonly authService: AuthService) { }

  validationRules?(): any {
    return {
      name: new FormControl('', [Validators.required]),
    };
  }
}
