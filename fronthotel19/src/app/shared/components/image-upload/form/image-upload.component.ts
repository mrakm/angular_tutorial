import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
/**
 * Use ng2-file-upload for file uploading from angular side
 */
import { FileUploader } from 'ng2-file-upload';
import { GLOBALS } from 'src/app/config/globals';
import { GenericService } from 'src/app/shared/helper/generic.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

/**
 * Given the backend API URL
 */
let url = `${environment.serverUrl}/settings/attachments/uploadImage`;

/**
 * How to use it
 *
 * <image-upload-form
 *
 *      [parentId] //parent Id for which you want to attach files like [parentId]= 1
 *      [parent] // parent name for which you want to attach files like parent="'campus'"
 *      [description] // Discriprtion like description="'about image'"
 *      [title] // like title="'Product image'"
 *      [navigateUrl] // navigateUrl where you want to Navigate after ulpoad like navigateUrl="'/customer/product'"
 *      [fileFilter] // add filtration of attachment from front end and backend both  like [fileFilter]="'.jpg,.jpeg,.png'" by default select all files
 *      [fileSize] // Attachment size in MB like [fileSize]=1 by default 1MB
 * >
 * </image-upload-form>
 */
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
// , OnChanges
export class ImageUploadComponent implements OnInit, OnChanges {

  @Input() parentId: number;
  @Input() parent: string;
  @Input() description: string;
  @Input() title: string;
  @Input() fileFilter: string;
  @Input() fileSize: number;
  @Input() navigateUrl: string;
  @Input() start: boolean;

  localImageUrl;
  uploader: FileUploader = new FileUploader({});
  private readonly authHeader: Array<{ name: string; value: string; }> = [];
  isLoading: boolean;

  constructor(
    private readonly router: Router,
    private readonly genericService: GenericService,
    private readonly communicationService: CommunicationService,
    public sanitizer: DomSanitizer,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {
    this.uploader.onAfterAddingFile = fileItem => {
      const latestFile = this.uploader.queue[this.uploader.queue.length - 1];
      this.uploader.queue = [];
      this.uploader.queue.push(latestFile);
      const fileUrl = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      this.localImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${fileUrl})`);
      if (this.start) {
        this.ConfigureUploader();
      }
    };
  }

  ngOnInit(): void {
    if (this.parent && this.parentId) {
      this.checkExistingImage();
    }
  }

  ngOnChanges(): void {
    if (this.start) {
      if (this.uploader.queue.length) {
        this.ConfigureUploader();
      }
    }
  }

  checkExistingImage(): void {

    this.genericService.__post('/settings/attachments/getFileByParent', { id: this.parentId, parent: this.parent }, true).subscribe((result: any) => {
      if (result.size) {
        this.localImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${URL.createObjectURL(result)})`);
        url = `${environment.serverUrl}/settings/attachments/updateImage`;
      } else {
        this.localImageUrl = null;
      }
      this.isLoading = false;

    });
  }

  ConfigureUploader(): void {

    // Setting the default file size to 1MB
    if (!this.fileSize) {
      this.fileSize = 1;
    }
    // Setting authentication by given the jwt token in headers
    this.authHeader.push({ name: 'token', value: JSON.parse(localStorage.getItem('currentUser'))['token'] });

    this.uploader.setOptions({
      url: `${url}/${this.parent}/${this.parentId}/${this.fileFilter}/${this.fileSize}`,
      additionalParameter: { parent: this.parent, parentId: this.parentId, description: this.description, title: this.title },
      headers: this.authHeader
    });

    this.uploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
    };

    this.uploader.onProgressItem = (item: any) => {
      if (item.file.size / 1024 / 1024 > this.fileSize) {
        item.error = true;
        item.errorStatus = 403;
        item.cancel();
      } else if (!this.validateFileType(item.file, this.fileFilter) && this.fileFilter) {
        item.error = true;
        item.errorStatus = 400;
        item.cancel();
      }
    };

    // setting the error when item is not uploaded
    this.uploader.onErrorItem = (item: any, response, status) => {
      item.error = true;
      item.errorStatus = status;
    };

    // in case of item successfully uploaded
    this.uploader.onSuccessItem = (item: any, response, status, headers) => {
      item.error = false;
    };

    this.uploader.onCompleteAll = () => {
      if (this.navigateUrl) {
        setTimeout(() => {
          this.router.navigate([this.navigateUrl]);
        }, 0);
      }
      this.communicationService.setImageChangeState(true);
      url = `${environment.serverUrl}/settings/attachments/updateImage`;
    };
    this.uploader.uploadAll();
  }

  private validateFileType(file, fileFilter): boolean {

    let isAllow = false;
    let _fileFilter = this.fileFilter;

    // extension of existing file
    const tmpAry = file.name.split('.');
    const ext = '.' + tmpAry[tmpAry.length - 1].toLowerCase();

    // remove spaces
    if (_fileFilter) {
      _fileFilter = _fileFilter.replace(' ', '');
      const _fileFilterArray = _fileFilter.split(',');

      _fileFilterArray.forEach(element => {
        if (ext === element) {
          isAllow = true;

          return;
        }
      });
    }

    return isAllow;
  }

  private delete(): void {
    this.matDialog
      .open(ConfirmDialogComponent, {
        width: GLOBALS.deleteDialog.width,
        data: { title: GLOBALS.deleteDialog.title, message: GLOBALS.deleteDialog.message }
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.isLoading = true;
          const queryParams = { parent: this.parent, parentId: this.parentId };
          this.genericService.
            get(`/settings/attachments/list/${queryParams['parent']}/${queryParams['parentId']}`).subscribe(response => {
              if (response) {
                this.genericService.delete(`/settings/attachments/delete/${response['rows'][0].id}`)
                  .subscribe(
                    response => {
                      this.matSnackBar.open('Attachment has been deleted.', 'OK', {
                        verticalPosition: 'top',
                        duration: 3000
                      });

                      setTimeout(() => {
                        this.checkExistingImage();
                      }, 1000);
                    },
                    error => {
                      this.matSnackBar.open('Something went wrong, please try again.', 'OK', {
                        verticalPosition: 'top',
                        duration: 3000
                      });
                    }
                  );
              }
            })
        }
      });
  }
}
