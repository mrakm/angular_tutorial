import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { GLOBALS } from 'src/app/config/globals';
import { GenericService } from 'src/app/shared/helper/generic.service';
import { AttachedFileModel } from 'src/app/shared/models/attached-file';
import { AttachedFileService } from 'src/app/shared/services/attached-file.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

interface IFormValues {
  parent: string;
  parentId: number;
  floorId: string;
  categoryId: string;
  fileSize?: number;
  fileFilter?: string;
  displayInList?: boolean;
  displayActionButtons?: boolean;
  isDialog?: boolean;
  canUpload?: any;
  canView?: boolean;
  canDelete?: boolean;
  triggerUpload?: boolean;
}
/**
 * How to use it
 *
 * <shared-attachment-list
 *
 *    [parentId] //parent Id for which you want to attach files like [parentId]= 1
 *    [parent] // parent name for which you want to attach files like parent="'campus'"
 *
 * >
 *
 * </shared-attachment-list>
 *
 * @export
 * @class AttachmentListComponent
 * @implements {OnInit}
 */

@Component({
  selector: 'shared-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss']
})
export class AttachmentListComponent implements OnInit, OnDestroy {
  @Input() formValues: IFormValues;

  public isViewFile: boolean;
  public numberOfAttachedFiles: number;
  public loaded = false;

  public data: AttachedFileModel[] = [new AttachedFileModel()];

  public attrLabels = AttachedFileModel.attributesLabels;

  displayedColumns = ['fileMeta', 'createdAt', 'fileType', 'options'];

  public panelOpenState = false;
  private attSubscription: Subscription;
  canUpload: boolean;
  canDelete: boolean;
  canView: boolean;
  viewImage = '';

  constructor(
    private _genericService: GenericService,
    private attachedFileService: AttachedFileService,
    public dialog: MatDialog,
    public matDialog: MatDialog,
    private router: Router,
    private _matSnackBar: MatSnackBar
  ) {}

  /**
   * Initialize page
   */
  ngOnInit(): void {
    if (this.formValues?.canUpload != null) this.canUpload = this.formValues?.canUpload;
    if (this.formValues?.canDelete != null) this.canDelete = this.formValues?.canDelete;
    if (this.formValues?.canView != null) this.canView = this.formValues?.canView;
    if (this.formValues['displayActionButtons']) {
      this.getRecords();
      // this.getRecordsByFloor();
    }
    this.attSubscription = this.attachedFileService.setIsAdded$.subscribe(res => {
      if (res) {
        this.getRecords();
        // this.getRecordsByFloor();
      }
    });
  }

  /**
   * Get data/records from backend
   */
  getRecords(): void {
    const queryParams = { parent: this.formValues.parent, parentId: this.formValues.parentId };

    this._genericService.get(`/settings/attachments/list/${queryParams['parentId']}`).subscribe(
      response => {
        if (response) {
          this.numberOfAttachedFiles = response['count'];
          this.data = response['rows'];
        }
      },
      error => {
        console.log(error);
        this.loaded = true;
      },
      () => {
        this.loaded = true;
      }
    );
  }

  getRecordsByFloor(): void {
    const queryParams = {
      parent: this.formValues.parent,
      parentId: this.formValues.parentId,
      floorId: this.formValues.floorId,
      categoryId: this.formValues.categoryId
    };

    this._genericService.get(`/settings/attachments/listByFloor/${queryParams['floorId']}`).subscribe(
      response => {
        if (response) {
          this.numberOfAttachedFiles = response['count'];
          this.data = response['rows'];
        }
      },
      error => {
        console.log(error);
        this.loaded = true;
      },
      () => {
        this.loaded = true;
      }
    );
  }

  /**
   * Delete record
   */
  delete(id: number): void {
    // Confirm dialog
    this.matDialog
      .open(ConfirmDialogComponent, {
        width: GLOBALS.deleteDialog.width,
        data: { title: GLOBALS.deleteDialog.title, message: GLOBALS.deleteDialog.message }
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.loaded = false;
          this._genericService.delete(`/settings/attachments/delete/${id}`).subscribe(
            response => {
              this._matSnackBar.open('Attachment has been deleted.', 'OK', {
                verticalPosition: 'top',
                duration: 3000
              });
              setTimeout(() => {
                this.getRecords();
              }, 1000);
            },
            error => {
              this._matSnackBar.open('Something went wrong, please try again.', 'OK', {
                verticalPosition: 'top',
                duration: 3000
              });
            }
          );
        }
      });
  }

  /**
   * View the all attached file of specific attachment
   */
  viewAttachedFiles(): void {
    if (this.isViewFile) {
      this.isViewFile = false;
    } else {
      this.isViewFile = true;
    }
  }

  /**
   * Downloading File
   *
   */
  public download(id: number, fileName: string): void {
    const item = { id: id };
    this._genericService.__post(`/settings/attachments/download`, item, true).subscribe(
      response => {
        saveAs(response, fileName);
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * Open File
   *
   */
  public open(id: number): void {
    const item = { id: id };
    this._genericService.__post(`/settings/attachments/download`, item, true).subscribe(
      response => {
        const fileURL = URL.createObjectURL(response);
        window.open(fileURL, '_blank');
        this.viewImage = fileURL;
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.attSubscription) {
      this.attSubscription.unsubscribe();
    }
  }
}
