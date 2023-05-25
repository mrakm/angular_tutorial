import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
import { OrderModule } from 'ngx-order-pipe';
import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { OrderFormComponent } from '../sale-item/order/form/order-form.component';
import * as fromComponents from './components';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { AttachmentComponent } from './components/attachment/form/attachment.component';
import { AttachmentListComponent } from './components/attachment/list/attachment-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ImageUploadComponent } from './components/image-upload/form/image-upload.component';
import { ImageViewComponent } from './components/image-upload/view/image-view.component';
import { MatSelectSearchComponent } from './components/mat-select-search/mat-select-search.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import * as fromDirectives from './directives';
import * as fromPipes from './pipes';
import { AttachedFileService } from './services/attached-file.service';
import { AttachmentService } from './services/attachment.service';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
const components = [
  fromComponents.NotificationCardComponent,
  fromComponents.ProgressSpinnerComponent,
  fromComponents.AngularEditorComponent,
  AttachmentListComponent,
  AttachmentComponent,
  ImageUploadComponent,
  ImageViewComponent
];
const directives = [
  fromDirectives.ClickOutsideDirective,
  fromDirectives.ShowAuthedDirective,
  fromDirectives.ClickStopPropagationDirective,
  fromDirectives.PercentageDirective
];
const pipes = [fromPipes.LengthPipe, fromPipes.MinusSignToParens, fromPipes.ThousandSuffixesPipe];

@NgModule({
  declarations: [
    ShowErrorsComponent,
    ...components,
    ...directives,
    ...pipes,
    AccountSettingsComponent,
    ConfirmDialogComponent,
    NotificationListComponent,
    MatSelectSearchComponent,
    ResetPasswordComponent,
    OrderFormComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,

    // @angular/forms
    FormsModule,
    ReactiveFormsModule,

    OrderModule,
    AngularMaterialModule,
    AngularEditorModule,
    FileUploadModule
  ],
  exports: [
    TranslateModule,
    CommonModule,

    // @angular/forms
    FormsModule,
    ReactiveFormsModule,

    ...components,
    ...directives,
    ...pipes,

    OrderModule,
    ShowErrorsComponent,
    AccountSettingsComponent,
    ConfirmDialogComponent,
    NotificationListComponent,
    MatSelectSearchComponent
  ],
  providers: [AttachmentService, AttachedFileService, pipes],
  entryComponents: [ConfirmDialogComponent, ResetPasswordComponent, OrderFormComponent]
})
export class SharedModule {}
