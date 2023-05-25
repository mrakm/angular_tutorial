import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GLOBALS } from 'src/app/config/globals';
import { AuthService, PNotifyService } from 'src/app/core';
import { Helpers } from 'src/app/shared/helper/helpers';
import { UsersService } from 'src/app/shared/services/user.service';
import { UsersModel } from '../../../models/users.model';

import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-user-form',
  styleUrls: ['./user-form.component.scss'],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  isLoading = false;
  pageActions = GLOBALS.pageActions;
  fg: FormGroup;
  pageAct: string;
  user: UsersModel;
  componentLabels = UsersModel.attributesLabels;
  pnotify;
  roles: any;
  users: any;
  employees: any;
  contractors: any;
  filteredRole: Observable<Array<any>>;
  

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly userService: UsersService,
    private readonly roleService: RoleService,
  
    // private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
    pNotifyService: PNotifyService
  ) {
    this.pageAct = route.snapshot.data.act;
    this.pnotify = pNotifyService.get();
    this.getAllConfigurations();
  }

  ngOnInit(): void {
    this.initializePage();
  }

  saveData(item: any): void {
    if (this.fg.get('userType').value === 'Contractor') {
      item.employeeId = item.contractorId;
      item.application = 'Contractor';
    }
    this.isLoading = true;
    if (this.pageAct === this.pageActions.create) {
      this.userService.create(item).subscribe(
        () => {
          this.pnotify.success({
            title: 'Success!',
            text: 'User has been created.'
          });
          this.isLoading = false;
          this.router.navigate(['/a/configuration/users']);
        },
        error => {
          this.pnotify.error({
            title: 'Oops!',
            text: error.error.message
          });
          this.isLoading = false;
        }
      );
    } else if (this.pageAct === this.pageActions.update) {
      this.userService.update(this.user.id, item).subscribe(
        () => {
          this.pnotify.success({
            title: 'Success!',
            text: 'User has been updated.'
          });
          this.isLoading = false;
          this.router.navigate(['/a/configuration/users']);
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
  }

  initializePage(): void {
    this.fg = this.fb.group(new UsersModel(this.authService).validationRules());
    if (this.pageAct === this.pageActions.create) {
      this.initCreatePage();
    } else {
      this.getData();
    }
  }

  getData(): void {
    this.route.params.subscribe(params => {
      forkJoin([this.userService.find(params.id).pipe(take(1))]).subscribe(
        ([userRes]: any) => {
          userRes.application = null;
          this.user = userRes;

          this.fg.patchValue(this.user);
          if (this.pageAct === this.pageActions.update) {
            this.initUpdatePage();
          }
          this.isLoading = false;
        },
        error => {
          this.pnotify.error({
            title: 'Oops!',
            text: error.error.message
          });
          this.isLoading = false;
        }
      );
    });
  }

  initCreatePage(): void {
    this.user = new UsersModel(this.authService);
    this.fg.enable();
  }

  initUpdatePage(): void {
    this.fg.removeControl('password');
    this.fg.removeControl('confirmPassword');
    this.fg.enable();
    this.fg.get('userName').disable();
    this.fg.get('employeeId').disable();
  }

  isEqual(): boolean {
    if (this.fg.get('password').value !== this.fg.get('confirmPassword').value) {
      this.fg.get('confirmPassword').setErrors({ 'not-equal': true });

      return false;
    }
  }

  isUserExist(): void {
    const userName = this.fg.get('userName').value.toLowerCase();
    if (_.find(this.users, (o: any) => o.userName.toLowerCase() === userName)) {
      this.fg.get('userName').setErrors({ 'is-exist': true });
    }
  }

  private getAllConfigurations(): void {
    const data$ = [
      this.roleService.findAll(),
      // this.userService.getAll(),
      // this.employeeService.findAllWithoutLogins(),
      // this.contractorService.findAllWithoutLogins()
    ];

    forkJoin(data$).subscribe(([roles, employees, contractorRes]: any) => {
      this.roles = roles;
      // this.users = users;
      this.employees = employees;
      this.contractors = contractorRes;

      this.filteredRole = Helpers.genericFiltration(this.fg.get('roleFilterCtrl'), this.roles, 'name');

    });
  }

  // changeType() {
  //   if (this.fg.get('userType').value === 'Contractor') {
  //     this.fg.get('employeeId').clearValidators();
  //     this.fg.controls['employeeId'].updateValueAndValidity();
  //     this.fg.get('contractorId').setValidators([Validators.required]);
  //     this.fg.controls['contractorId'].updateValueAndValidity();
  //   } else {
  //     this.fg.get('contractorId').clearValidators();
  //     this.fg.controls['contractorId'].updateValueAndValidity();
  //     this.fg.get('employeeId').setValidators([Validators.required]);
  //     this.fg.controls['employeeId'].updateValueAndValidity();
  //   }
  // }
}
