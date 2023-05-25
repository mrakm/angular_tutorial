import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
/**
 * Use ng2-file-upload for file uploading from angular side
 */
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { PNotifyService } from 'src/app/core';
import { GenericService } from 'src/app/shared/helper/generic.service';
import { AttachedFileService } from 'src/app/shared/services/attached-file.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { environment } from 'src/environments/environment';

/**
 * Given the backend API URL
 */
const URL = environment.serverUrl + '/settings/attachments/fileUpload/';

/**
 * How to use it
 *
 * <shared-attachment
 *
 *      [parentId] //parent Id for which you want to attach files like [parentId]= 1
 *      [parent] // parent name for which you want to attach files like parent="'campus'"
 *      [fileFilter] // add filtration of attachment from front end and backend both  like [fileFilter]="'.jpg,.jpeg,.png'" by default select all files
 *      [fileSize] // Attachment size in MB like [fileSize]=1 by default 1MB
 * >
 * </shared-attachment>
 */
@Component({
  selector: 'shared-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() parentId: number;
  @Input() parent: string;
  @Input() floorId: string;
  @Input() categoryId: string;
  @Input() description: string;
  @Input() title: string;
  @Input() fileFilter: string;
  @Input() fileSize: number;
  @Input() displayActionButtons: boolean;
  @Input() navigate: string;
  @Input() single: boolean;
  @Input() canUpload: boolean;
  @Input() triggerUpload: boolean;
  pNotify: any;

  private navigateUrl: string;
  public uploader: FileUploader;

  private attSubscription: Subscription;

  private authHeader: Array<{
    name: string;
    value: string;
  }> = [];

  constructor(private readonly pNotifyService: PNotifyService, private _router: Router, private _attachedFileService: AttachedFileService) {
    this.pNotify = this.pNotifyService.get();
  }

  ngOnInit(): void {
    this.uploaderConfig();
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (!changes.parentId.firstChange || changes.triggerUpload.currentValue) {
      this.parentId = changes.parentId.currentValue;
      this.uploader.setOptions({
        url: URL + this.parent + '/' + this.parentId + '/' + this.fileFilter + '/' + this.fileSize,
        additionalParameter: { parentId: this.parentId, parent: this.parent, description: this.description, title: this.title },
        headers: this.authHeader
      });
      this.uploader.uploadAll();
      this._router.navigate([this.navigate]);
    }
  }

  /**
   *
   * Setting the Configuiration of ng2-file-uploader
   * @memberof AttachmentFormComponent
   */
  public uploaderConfig(): void {
    // Setting authentication by given the jwt token in headers
    this.authHeader.push({ name: 'token', value: JSON.parse(localStorage.getItem('currentUser'))['token'] });

    //Setting the default file size to 1MB
    if (!this.fileSize) {
      this.fileSize = 1;
    }

    // Given api url,with query params, additional parematers for atatchment and authentication header
    this.uploader = new FileUploader({
      url: URL + this.parent + '/' + this.parentId + '/' + this.fileFilter + '/' + this.fileSize,
      additionalParameter: { parentId: this.parentId, parent: this.parent, description: this.description, title: this.title },
      headers: this.authHeader
    });

    // With no credentials
    this.uploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
    };
    this.uploader.onProgressItem = item => {
      if (item.file.size / 1024 / 1024 > this.fileSize) {
        item['error'] = true;
        item['errorStatus'] = 403;
        item.cancel();
      } else if (!this.validateFileType(item.file) && this.fileFilter) {
        item['error'] = true;
        item['errorStatus'] = 400;
        item.cancel();
      }
    };

    // setting the error when itemn is not uploaded
    this.uploader.onErrorItem = (item, response, status) => {
      item['error'] = true;
      item['errorStatus'] = status;
    };

    // in case of item successfully uploaded
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      item['error'] = false;
      this._attachedFileService.setIsAdded(true);
    };

    this.uploader.onCompleteAll = () => {
      this.uploader.queue.forEach((item, index) => {
        if (item['errorStatus'] === 403) {
          this.pNotify.error({ title: 'Failed!', text: `${item.file.name} - Invalid file size. Max file size is ${this.fileSize}MB` });
        } else {
          this.pNotify.success({ title: 'Success!', text: `${item.file.name} uploaded successfully` });
        }
      });

      this.uploader.queue = [];
      if (this.navigateUrl) {
        this._router.navigate([this.navigateUrl]);
      }
    };
    this.uploader.onProgressAll = () => {};
  }

  validateFileType(file): boolean {
    let isAllow = false;
    let _fileFilter = this.fileFilter;

    // extension of existing file
    const tmpAry = file['name'].split('.');
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

  ngOnDestroy(): void {
    if (this.attSubscription) {
      this.attSubscription.unsubscribe();
    }
  }
}
